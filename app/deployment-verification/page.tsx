"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VerificationTest {
  name: string
  status: "pending" | "running" | "success" | "error"
  message: string
  details?: any
  duration?: number
}

export default function DeploymentVerificationPage() {
  const [tests, setTests] = useState<VerificationTest[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"pending" | "success" | "error">("pending")

  const verificationTests = [
    {
      name: "Health Check API",
      endpoint: "/api/health",
      test: async (response: Response, data: any) => ({
        success: response.ok && data.status === "healthy",
        details: data,
      }),
    },
    {
      name: "Environment Variables",
      endpoint: "/api/env-check",
      test: async (response: Response, data: any) => ({
        success: response.ok && data.status === "success",
        details: data.environment,
      }),
    },
    {
      name: "Deployment Status",
      endpoint: "/api/deployment-status",
      test: async (response: Response, data: any) => ({
        success: response.ok && data.status === "deployed",
        details: data.vercel,
      }),
    },
    {
      name: "Demo Trading API",
      endpoint: "/api/demo-trading/status",
      test: async (response: Response, data: any) => ({
        success: response.ok && data.success,
        details: data.status,
      }),
    },
    {
      name: "Connection Testing",
      endpoint: "/api/test-connections",
      test: async (response: Response, data: any) => ({
        success: response.ok && data.success,
        details: data.summary,
      }),
    },
  ]

  const runVerification = async () => {
    setIsRunning(true)
    setTests([])
    setOverallStatus("pending")

    const results: VerificationTest[] = []

    for (const testConfig of verificationTests) {
      const testResult: VerificationTest = {
        name: testConfig.name,
        status: "running",
        message: "Testing...",
      }

      setTests((prev) => [...prev, testResult])

      const startTime = Date.now()

      try {
        const response = await fetch(testConfig.endpoint)
        const data = await response.json()
        const duration = Date.now() - startTime

        const testOutcome = await testConfig.test(response, data)

        const updatedResult: VerificationTest = {
          name: testConfig.name,
          status: testOutcome.success ? "success" : "error",
          message: testOutcome.success ? "✅ Passed" : "❌ Failed",
          details: testOutcome.details,
          duration,
        }

        results.push(updatedResult)
        setTests((prev) => prev.map((t) => (t.name === testConfig.name ? updatedResult : t)))
      } catch (error) {
        const updatedResult: VerificationTest = {
          name: testConfig.name,
          status: "error",
          message: `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          duration: Date.now() - startTime,
        }

        results.push(updatedResult)
        setTests((prev) => prev.map((t) => (t.name === testConfig.name ? updatedResult : t)))
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Determine overall status
    const allPassed = results.every((r) => r.status === "success")
    setOverallStatus(allPassed ? "success" : "error")
    setIsRunning(false)
  }

  useEffect(() => {
    runVerification()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "running":
        return <Badge variant="secondary">Running...</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Deployment Verification</h1>
        <p className="text-muted-foreground">Comprehensive testing of your Vercel deployment</p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Status</span>
            <span className={`text-2xl font-bold ${getOverallStatusColor()}`}>
              {overallStatus === "pending" && "🔄 Testing..."}
              {overallStatus === "success" && "🎉 All Systems Go!"}
              {overallStatus === "error" && "⚠️ Issues Detected"}
            </span>
          </CardTitle>
          <CardDescription>
            {overallStatus === "success" && "Your deployment is healthy and ready for trading!"}
            {overallStatus === "error" && "Some tests failed. Check the details below."}
            {overallStatus === "pending" && "Running verification tests..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={runVerification} disabled={isRunning}>
              {isRunning ? "Running Tests..." : "Run Verification Again"}
            </Button>
            {overallStatus === "success" && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/continuous-demo">Start Demo Trading</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid gap-4">
        {tests.map((test, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {test.duration && <span className="text-sm text-muted-foreground">{test.duration}ms</span>}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{test.message}</p>
              {test.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common next steps after verification</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <Button variant="outline" asChild>
            <a href="/diagnostics">Full Diagnostics</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/setup">API Setup</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/api/health" target="_blank" rel="noreferrer">
              View Health API
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/api/deployment-status" target="_blank" rel="noreferrer">
              View Deployment Info
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Information</CardTitle>
          <CardDescription>Current deployment details from Vercel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Environment:</span>
              <span>{process.env.NODE_ENV || "development"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vercel URL:</span>
              <span>{process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Git Commit:</span>
              <span className="font-mono text-xs">{process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || "local"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Git Branch:</span>
              <span>{process.env.VERCEL_GIT_COMMIT_REF || "local"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
