"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Issue {
  category: string
  severity: "critical" | "warning" | "info"
  problem: string
  solution: string
  autoFix?: () => Promise<void>
  status: "detected" | "fixing" | "fixed" | "failed"
}

export default function TroubleshootPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [fixingAll, setFixingAll] = useState(false)

  const detectIssues = async () => {
    setIsScanning(true)
    const detectedIssues: Issue[] = []

    try {
      // Check API Health
      const healthResponse = await fetch("/api/health")
      if (!healthResponse.ok) {
        detectedIssues.push({
          category: "API Health",
          severity: "critical",
          problem: "Health API is not responding correctly",
          solution: "Check server logs and restart the application",
          status: "detected",
        })
      } else {
        const healthData = await healthResponse.json()

        // Check memory usage
        const memoryMB = Math.round(healthData.memory?.heapUsed / 1024 / 1024) || 0
        if (memoryMB > 100) {
          detectedIssues.push({
            category: "Performance",
            severity: "warning",
            problem: `High memory usage detected: ${memoryMB}MB`,
            solution: "Optimize code and reduce memory footprint",
            status: "detected",
          })
        }
      }

      // Check Environment Variables
      const envResponse = await fetch("/api/env-check")
      if (!envResponse.ok) {
        detectedIssues.push({
          category: "Environment",
          severity: "critical",
          problem: "Environment check API failed",
          solution: "Verify all required environment variables are set",
          status: "detected",
        })
      } else {
        const envData = await envResponse.json()
        if (!envData.allRequired) {
          detectedIssues.push({
            category: "Environment",
            severity: "critical",
            problem: "Missing required environment variables",
            solution: "Add missing API keys and secrets in Vercel dashboard",
            status: "detected",
          })
        }
      }

      // Check Demo Trading
      try {
        const demoResponse = await fetch("/api/demo-trading/status")
        if (!demoResponse.ok) {
          detectedIssues.push({
            category: "Demo Trading",
            severity: "warning",
            problem: "Demo trading service not available",
            solution: "Restart demo trading service",
            autoFix: async () => {
              await fetch("/api/demo-trading/start", { method: "POST" })
            },
            status: "detected",
          })
        }
      } catch (error) {
        detectedIssues.push({
          category: "Demo Trading",
          severity: "critical",
          problem: "Demo trading API endpoint not found",
          solution: "Check API routes and deployment",
          status: "detected",
        })
      }

      // Check Exchange Connections
      try {
        const connectionsResponse = await fetch("/api/test-connections")
        if (!connectionsResponse.ok) {
          detectedIssues.push({
            category: "Exchange Connections",
            severity: "warning",
            problem: "Exchange connection test failed",
            solution: "Verify exchange API credentials and network connectivity",
            status: "detected",
          })
        } else {
          const connectionsData = await connectionsResponse.json()
          if (!connectionsData.allConnected && connectionsData.summary?.successful === 0) {
            detectedIssues.push({
              category: "Exchange Connections",
              severity: "warning",
              problem: "No exchange connections available",
              solution: "Configure testnet/demo API credentials for at least one exchange",
              status: "detected",
            })
          }
        }
      } catch (error) {
        detectedIssues.push({
          category: "Exchange Connections",
          severity: "critical",
          problem: "Exchange connection API not accessible",
          solution: "Check API routes and ensure proper deployment",
          status: "detected",
        })
      }

      // Check Deployment Status
      try {
        const deploymentResponse = await fetch("/api/deployment-status")
        if (!deploymentResponse.ok) {
          detectedIssues.push({
            category: "Deployment",
            severity: "critical",
            problem: "Deployment status API not working",
            solution: "Check Vercel deployment and environment variables",
            status: "detected",
          })
        } else {
          const deploymentData = await deploymentResponse.json()
          if (!deploymentData.vercel?.commitSha || deploymentData.vercel.commitSha === "local") {
            detectedIssues.push({
              category: "Deployment",
              severity: "warning",
              problem: "Missing Vercel environment variables",
              solution: "Ensure VERCEL_GIT_COMMIT_SHA and related variables are set",
              status: "detected",
            })
          }
        }
      } catch (error) {
        detectedIssues.push({
          category: "Deployment",
          severity: "critical",
          problem: "Cannot access deployment status",
          solution: "Check if application is properly deployed on Vercel",
          status: "detected",
        })
      }

      // If no issues found, add a success message
      if (detectedIssues.length === 0) {
        detectedIssues.push({
          category: "System Health",
          severity: "info",
          problem: "No critical issues detected",
          solution: "System appears to be functioning normally",
          status: "fixed",
        })
      }

      setIssues(detectedIssues)
    } catch (error) {
      detectedIssues.push({
        category: "System",
        severity: "critical",
        problem: "Failed to run diagnostic scan",
        solution: "Check network connectivity and try again",
        status: "detected",
      })
      setIssues(detectedIssues)
    }

    setIsScanning(false)
  }

  const fixIssue = async (index: number) => {
    const issue = issues[index]
    if (!issue.autoFix) return

    setIssues((prev) => prev.map((item, i) => (i === index ? { ...item, status: "fixing" } : item)))

    try {
      await issue.autoFix()
      setIssues((prev) => prev.map((item, i) => (i === index ? { ...item, status: "fixed" } : item)))
    } catch (error) {
      setIssues((prev) => prev.map((item, i) => (i === index ? { ...item, status: "failed" } : item)))
    }
  }

  const fixAllIssues = async () => {
    setFixingAll(true)

    for (let i = 0; i < issues.length; i++) {
      if (issues[i].autoFix && issues[i].status === "detected") {
        await fixIssue(i)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait between fixes
      }
    }

    setFixingAll(false)

    // Re-scan after fixes
    setTimeout(() => {
      detectIssues()
    }, 2000)
  }

  useEffect(() => {
    detectIssues()
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">🚨 Critical</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">ℹ️ Info</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "detected":
        return <Badge variant="outline">🔍 Detected</Badge>
      case "fixing":
        return <Badge className="bg-blue-100 text-blue-800">🔧 Fixing...</Badge>
      case "fixed":
        return <Badge className="bg-green-100 text-green-800">✅ Fixed</Badge>
      case "failed":
        return <Badge variant="destructive">❌ Fix Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const criticalIssues = issues.filter((i) => i.severity === "critical" && i.status === "detected").length
  const warningIssues = issues.filter((i) => i.severity === "warning" && i.status === "detected").length
  const fixableIssues = issues.filter((i) => i.autoFix && i.status === "detected").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🔧 System Troubleshoot</h1>
        <p className="text-muted-foreground">Identify and fix deployment issues automatically</p>
      </div>

      {/* Summary */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Issue Summary</span>
            <div className="flex gap-2">
              {criticalIssues > 0 && <Badge variant="destructive">{criticalIssues} Critical</Badge>}
              {warningIssues > 0 && <Badge className="bg-yellow-100 text-yellow-800">{warningIssues} Warnings</Badge>}
            </div>
          </CardTitle>
          <CardDescription>
            {criticalIssues > 0
              ? `${criticalIssues} critical issues need immediate attention`
              : warningIssues > 0
                ? `${warningIssues} warnings detected - system functional but not optimal`
                : "System health check complete"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={detectIssues} disabled={isScanning}>
              {isScanning ? "🔍 Scanning..." : "🔄 Re-scan Issues"}
            </Button>
            {fixableIssues > 0 && (
              <Button onClick={fixAllIssues} disabled={fixingAll} className="bg-green-600 hover:bg-green-700">
                {fixingAll ? "🔧 Fixing..." : `🛠️ Auto-fix ${fixableIssues} Issues`}
              </Button>
            )}
            <Button variant="outline" asChild>
              <a href="/deployment-success">📊 Re-test Deployment</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="grid gap-4">
        {issues.map((issue, index) => (
          <Card key={index} className={issue.severity === "critical" ? "border-red-200" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{issue.category}</CardTitle>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(issue.severity)}
                  {getStatusBadge(issue.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-red-700">Problem:</h4>
                  <p className="text-sm text-muted-foreground">{issue.problem}</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Solution:</h4>
                  <p className="text-sm text-muted-foreground">{issue.solution}</p>
                </div>
                {issue.autoFix && issue.status === "detected" && (
                  <Button size="sm" onClick={() => fixIssue(index)} className="bg-blue-600 hover:bg-blue-700">
                    🔧 Auto-fix This Issue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manual Fix Guide */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Manual Fix Guide</CardTitle>
          <CardDescription>Step-by-step instructions for common issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700">Critical: Missing Environment Variables</h4>
              <ol className="text-sm text-gray-600 mt-2 space-y-1">
                <li>1. Go to your Vercel dashboard</li>
                <li>2. Select your project → Settings → Environment Variables</li>
                <li>3. Add the missing variables (check /setup page for required keys)</li>
                <li>4. Redeploy your application</li>
              </ol>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-700">Warning: Exchange Connections</h4>
              <ol className="text-sm text-gray-600 mt-2 space-y-1">
                <li>1. Visit /setup page to configure API credentials</li>
                <li>2. Use testnet/demo accounts only for safety</li>
                <li>3. Test connections individually</li>
                <li>4. Ensure API keys have proper permissions</li>
              </ol>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700">Info: Performance Optimization</h4>
              <ol className="text-sm text-gray-600 mt-2 space-y-1">
                <li>1. Monitor memory usage in /status page</li>
                <li>2. Restart demo trading if needed</li>
                <li>3. Clear browser cache and refresh</li>
                <li>4. Check Vercel function logs for errors</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Next Steps</CardTitle>
          <CardDescription>Recommended actions after troubleshooting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button variant="outline" asChild>
            <a href="/setup">⚙️ Configure APIs</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/deployment-success">📊 Re-test System</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/status">📈 Monitor Health</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
