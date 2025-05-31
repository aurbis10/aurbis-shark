"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null)
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllStatus()
    const interval = setInterval(loadAllStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadAllStatus = async () => {
    try {
      const [systemRes, deploymentRes, healthRes] = await Promise.all([
        fetch("/api/system-status"),
        fetch("/api/deployment-status"),
        fetch("/api/health"),
      ])

      const [systemData, deploymentData, healthData] = await Promise.all([
        systemRes.json(),
        deploymentRes.json(),
        healthRes.json(),
      ])

      setSystemStatus(systemData.system)
      setDeploymentStatus(deploymentData.deployment)
      setHealthStatus(healthData.health)
    } catch (error) {
      console.error("Failed to load status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
      case "online":
      case "active":
      case "ready":
      case "enabled":
      case "connected":
        return <Badge className="bg-green-100 text-green-800">✅ {status}</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ {status}</Badge>
      case "error":
      case "offline":
        return <Badge className="bg-red-100 text-red-800">❌ {status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">🔄</div>
          <p>Loading system status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">📊 System Status</h1>
        <p className="text-xl text-gray-600">Real-time monitoring of Aurbis Trading Bot</p>
      </div>

      {/* Overall Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🟢 System Overview</span>
            <Button onClick={loadAllStatus} variant="outline" size="sm">
              🔄 Refresh
            </Button>
          </CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm font-medium">All Systems</div>
              <div className="text-xs text-gray-500">Operational</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{healthStatus?.uptime || 0}s</div>
              <div className="text-sm font-medium">Uptime</div>
              <div className="text-xs text-gray-500">Since last restart</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{healthStatus?.memory?.used || 0}MB</div>
              <div className="text-sm font-medium">Memory</div>
              <div className="text-xs text-gray-500">Current usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">v{deploymentStatus?.version || "1.0.0"}</div>
              <div className="text-sm font-medium">Version</div>
              <div className="text-xs text-gray-500">Current build</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 Services Status</CardTitle>
            <CardDescription>Core system services and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(systemStatus.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium capitalize">{service.replace(/([A-Z])/g, " $1")}</span>
                  {getStatusBadge(status as string)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Features */}
      {deploymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle>⚡ Trading Features</CardTitle>
            <CardDescription>Available trading modes and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deploymentStatus.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium capitalize">{feature.replace(/([A-Z])/g, " $1")}</span>
                  <Badge className={enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {enabled ? "✅ Enabled" : "❌ Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exchange Connections */}
      {deploymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle>🏦 Exchange Connections</CardTitle>
            <CardDescription>API key configuration status for each exchange</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(deploymentStatus.exchanges).map(([exchange, config]: [string, any]) => (
                <div key={exchange} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg capitalize">{exchange}</span>
                    <Badge variant="outline">{exchange.toUpperCase()}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Testnet/Demo:</span>
                      <Badge
                        className={
                          config.testnet || config.demo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {config.testnet || config.demo ? "✅ Configured" : "❌ Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Live Trading:</span>
                      <Badge className={config.live ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                        {config.live ? "⚠️ Available" : "🔒 Not Set"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle>📈 Performance Metrics</CardTitle>
            <CardDescription>System performance and resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-medium">Uptime</div>
                <div className="text-2xl font-bold text-blue-600">{systemStatus.performance.uptime}s</div>
                <div className="text-xs text-blue-500">Continuous operation</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 font-medium">Memory Usage</div>
                <div className="text-2xl font-bold text-green-600">{systemStatus.performance.memoryUsage}MB</div>
                <div className="text-xs text-green-500">Current allocation</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700 font-medium">Response Time</div>
                <div className="text-2xl font-bold text-purple-600">{systemStatus.performance.responseTime}</div>
                <div className="text-xs text-purple-500">Average API response</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Status */}
      {systemStatus && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">🔒 Security Status</CardTitle>
            <CardDescription>Security features and protections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(systemStatus.security).map(([feature, status]) => (
                <div key={feature} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium capitalize">{feature.replace(/([A-Z])/g, " $1")}</span>
                  {getStatusBadge(status as string)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Information */}
      {deploymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle>🚀 Deployment Information</CardTitle>
            <CardDescription>Current deployment details and environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Environment</div>
                <div className="font-medium">{deploymentStatus.environment}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Region</div>
                <div className="font-medium">{deploymentStatus.region}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Build Type</div>
                <div className="font-medium">{deploymentStatus.buildTime}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Production Ready</div>
                <Badge
                  className={
                    deploymentStatus.readyForProduction ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }
                >
                  {deploymentStatus.readyForProduction ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
