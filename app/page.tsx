"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState("checking")
  const [envStatus, setEnvStatus] = useState("checking")
  const [connectionStatus, setConnectionStatus] = useState("checking")

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      // Check API health
      const healthResponse = await fetch("/api/deployment-test")
      setSystemStatus(healthResponse.ok ? "online" : "error")

      // Check environment variables
      const envResponse = await fetch("/api/check-env")
      const envData = await envResponse.json()
      setEnvStatus(envData.allValid ? "configured" : "missing")

      // Check exchange connections
      const connResponse = await fetch("/api/test-connections")
      const connData = await connResponse.json()
      setConnectionStatus(connData.allConnected ? "connected" : "disconnected")
    } catch (error) {
      setSystemStatus("error")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
      case "configured":
      case "connected":
        return <Badge className="bg-green-600 text-white border-green-600">READY</Badge>
      case "error":
      case "missing":
      case "disconnected":
        return <Badge className="bg-red-600 text-white border-red-600">ERROR</Badge>
      default:
        return <Badge className="bg-yellow-600 text-white border-yellow-600">CHECKING</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Aurbis Trading Bot</h1>
        <p className="text-gray-400">Professional Cryptocurrency Arbitrage System</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              System Health
              {getStatusBadge(systemStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-400 text-xs">API endpoints and core functionality</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              Configuration
              {getStatusBadge(envStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-400 text-xs">Environment variables and API keys</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              Exchange Connections
              {getStatusBadge(connectionStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-400 text-xs">Binance, Bybit, and OKX connectivity</p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paper Trading */}
        <Card className="bg-gray-800 border-gray-700 hover:border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Paper Trading</CardTitle>
            <CardDescription className="text-gray-400">Virtual 100 USDT across three exchanges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Real market data feeds</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Virtual 100 USDT balance</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Risk-free learning</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Binance • Bybit • OKX</span>
              </div>
            </div>
            <Link href="/paper-trading">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Paper Trading</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Real Money Trading */}
        <Card className="bg-gray-800 border-gray-700 hover:border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Real Money Trading</CardTitle>
            <CardDescription className="text-gray-400">Live trading with actual funds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-red-500 mr-2">●</span>
                <span>Real exchange connections</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-red-500 mr-2">●</span>
                <span>Actual money at risk</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Enhanced safety features</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="text-green-500 mr-2">●</span>
                <span>Professional risk management</span>
              </div>
            </div>
            <Link href="/real-money-trading">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Real Money Trading</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-400 text-xs font-medium">TOTAL TRADES</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">0</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-400 text-xs font-medium">SUCCESS RATE</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-500">0%</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-400 text-xs font-medium">PAPER BALANCE</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-500">$100</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-400 text-xs font-medium">ACTIVE POSITIONS</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">QUICK ACTIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link href="/setup">
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white text-sm"
              >
                Setup
              </Button>
            </Link>
            <Link href="/diagnostics">
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white text-sm"
              >
                Diagnostics
              </Button>
            </Link>
            <Link href="/status">
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white text-sm"
              >
                Status
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white text-sm"
              onClick={checkSystemHealth}
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
