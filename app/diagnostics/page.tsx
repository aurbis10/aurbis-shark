"use client"

import { useState, useEffect } from "react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "loading"
  message: string
  details?: any
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    const tests = [
      {
        name: "API Health Check",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          return { success: response.ok, data }
        },
      },
      {
        name: "Environment Variables",
        test: async () => {
          const response = await fetch("/api/env-check")
          const data = await response.json()
          return { success: response.ok, data }
        },
      },
      {
        name: "Memory Usage",
        test: async () => {
          const response = await fetch("/api/health")
          const data = await response.json()
          const memoryMB = Math.round(data.memory?.heapUsed / 1024 / 1024) || 0
          return {
            success: memoryMB < 100, // Less than 100MB
            data: { memoryMB, limit: "128MB" },
          }
        },
      },
      {
        name: "Response Time",
        test: async () => {
          const start = Date.now()
          const response = await fetch("/api/health")
          const end = Date.now()
          const responseTime = end - start
          return {
            success: responseTime < 5000, // Less than 5 seconds
            data: { responseTime: `${responseTime}ms` },
          }
        },
      },
    ]

    for (const test of tests) {
      setResults((prev) => [...prev, { test: test.name, status: "loading", message: "Running..." }])

      try {
        const result = await test.test()
        setResults((prev) =>
          prev.map((r) =>
            r.test === test.name
              ? {
                  test: test.name,
                  status: result.success ? "success" : "error",
                  message: result.success ? "Passed" : "Failed",
                  details: result.data,
                }
              : r,
          ),
        )
      } catch (error) {
        setResults((prev) =>
          prev.map((r) =>
            r.test === test.name
              ? {
                  test: test.name,
                  status: "error",
                  message: error instanceof Error ? error.message : "Unknown error",
                }
              : r,
          ),
        )
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "error":
        return "text-red-600 bg-red-100"
      case "loading":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deployment Diagnostics</h1>
        <p className="mt-2 text-gray-600">Check your application health and identify deployment issues</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{result.test}</h3>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(result.status)}`}>
                  {result.status === "loading" ? "Running..." : result.message}
                </span>
              </div>
              {result.details && (
                <div className="mt-2 text-sm text-gray-600">
                  <pre className="bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Common Vercel Errors & Solutions</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-red-700">FUNCTION_INVOCATION_TIMEOUT (504)</h3>
            <p className="text-sm text-gray-600">
              Function took too long to respond. Optimize your API routes and reduce processing time.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-yellow-700">FUNCTION_PAYLOAD_TOO_LARGE (413)</h3>
            <p className="text-sm text-gray-600">Request or response payload is too large. Reduce data size.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-blue-700">NOT_FOUND (404)</h3>
            <p className="text-sm text-gray-600">
              Route not found. Check your file structure and routing configuration.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-purple-700">DEPLOYMENT_NOT_READY_REDIRECTING (303)</h3>
            <p className="text-sm text-gray-600">Deployment is still building. Wait for build to complete.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
