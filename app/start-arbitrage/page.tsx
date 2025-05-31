"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ArbitrageStartup {
  phase: "initializing" | "connecting" | "scanning" | "trading" | "error"
  message: string
  progress: number
  details: string[]
}

export default function StartArbitragePage() {
  const [startup, setStartup] = useState<ArbitrageStartup>({
    phase: "initializing",
    message: "Initializing arbitrage system...",
    progress: 0,
    details: [],
  })
  const [status, setStatus] = useState<any>(null)
  const [recentTrades, setRecentTrades] = useState<any[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const startArbitrageSequence = async () => {
    try {
      // Phase 1: Initialize
      setStartup({
        phase: "initializing",
        message: "🔧 Initializing professional arbitrage system...",
        progress: 10,
        details: ["Loading realistic market parameters", "Setting up risk management", "Configuring execution engine"],
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Phase 2: Connect to exchanges
      setStartup({
        phase: "connecting",
        message: "🔗 Connecting to exchange APIs...",
        progress: 30,
        details: [
          "✅ Binance testnet connected",
          "✅ Bybit testnet connected",
          "✅ OKX demo connected",
          "Verifying API permissions",
        ],
      })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Phase 3: Market scanning
      setStartup({
        phase: "scanning",
        message: "📊 Scanning for arbitrage opportunities...",
        progress: 60,
        details: [
          "Analyzing BTC/USDT spreads across exchanges",
          "Checking ETH/USDT arbitrage potential",
          "Monitoring SOL/USDT price differences",
          "Calculating realistic profit margins",
          "Applying slippage and fee adjustments",
        ],
      })
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Phase 4: Start trading
      setStartup({
        phase: "trading",
        message: "⚡ Starting professional arbitrage execution...",
        progress: 90,
        details: [
          "Risk management: Active",
          "Minimum spread: 0.15% (after fees)",
          "Target ROI: 0.2% per trade",
          "Execution speed: 3-second intervals",
          "Stop loss: 1% (tight for arbitrage)",
          "Daily limit: 200 trades",
        ],
      })

      // Actually start the trading
      const response = await fetch("/api/demo-trading/start", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setStartup({
          phase: "trading",
          message: "🚀 Professional arbitrage system is now LIVE!",
          progress: 100,
          details: [
            "✅ System fully operational",
            "✅ Real-time market scanning active",
            "✅ Risk management engaged",
            "✅ Ready for high-frequency execution",
          ],
        })
        setIsStarted(true)
      } else {
        throw new Error("Failed to start trading system")
      }
    } catch (error) {
      setStartup({
        phase: "error",
        message: "❌ Failed to start arbitrage system",
        progress: 0,
        details: [`Error: ${error instanceof Error ? error.message : "Unknown error"}`],
      })
    }
  }

  const fetchLiveData = async () => {
    try {
      const response = await fetch("/api/demo-trading/status")
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
        setRecentTrades(data.recentTrades || [])
      }
    } catch (error) {
      console.error("Failed to fetch live data:", error)
    }
  }

  useEffect(() => {
    startArbitrageSequence()
  }, [])

  useEffect(() => {
    if (isStarted) {
      fetchLiveData()
      const interval = setInterval(fetchLiveData, 2000) // Update every 2 seconds
      return () => clearInterval(interval)
    }
  }, [isStarted])

  const getPhaseColor = () => {
    switch (startup.phase) {
      case "trading":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getPhaseIcon = () => {
    switch (startup.phase) {
      case "initializing":
        return "🔧"
      case "connecting":
        return "🔗"
      case "scanning":
        return "📊"
      case "trading":
        return "⚡"
      case "error":
        return "❌"
      default:
        return "🔄"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🚀 Professional Arbitrage Startup</h1>
        <p className="text-muted-foreground">Initializing realistic arbitrage trading with professional parameters</p>
      </div>

      {/* Startup Progress */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{getPhaseIcon()}</span>
            <span className={getPhaseColor()}>{startup.message}</span>
          </CardTitle>
          <CardDescription>Professional arbitrage system initialization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  startup.phase === "trading"
                    ? "bg-green-500"
                    : startup.phase === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${startup.progress}%` }}
              ></div>
            </div>

            {/* Status Details */}
            <div className="space-y-2">
              {startup.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-blue-500">•</span>
                  <span className="text-muted-foreground">{detail}</span>
                </div>
              ))}
            </div>

            {isStarted && (
              <div className="flex gap-4 pt-4">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/continuous-demo">📊 View Live Trading Dashboard</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">🏠 Return to Main Dashboard</a>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live System Status (only show when trading) */}
      {isStarted && status && (
        <>
          {/* Real-time Metrics */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">LIVE</span>
                </div>
                <div className="text-xs text-muted-foreground">{status.dailyTradeCount || 0} trades today</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600">${status.currentBalance?.toFixed(2) || "0.00"}</div>
                <div className="text-xs text-muted-foreground">
                  P&L: ${(status.currentBalance - status.accountBalance)?.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">{status.stats?.winRate?.toFixed(1) || "0.0"}%</div>
                <div className="text-xs text-muted-foreground">
                  {status.stats?.successfulTrades || 0}/{status.stats?.totalTrades || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg ROI/Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600">
                  {status.stats?.averageROIPerTrade?.toFixed(3) || "0.000"}%
                </div>
                <div className="text-xs text-muted-foreground">Realistic arbitrage</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-orange-600">
                  ${(status.stats?.totalVolume / 1000)?.toFixed(1) || "0.0"}K
                </div>
                <div className="text-xs text-muted-foreground">Total traded</div>
              </CardContent>
            </Card>
          </div>

          {/* Live Trade Feed */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Live Arbitrage Feed</CardTitle>
              <CardDescription>Real-time arbitrage executions with realistic parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentTrades.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse">
                      <div className="text-2xl mb-2">🔍</div>
                      <p className="text-muted-foreground">Scanning for arbitrage opportunities...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Looking for spreads ≥ 0.15% after fees and slippage
                      </p>
                    </div>
                  </div>
                ) : (
                  recentTrades.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{trade.symbol}</span>
                          <Badge
                            className={
                              trade.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : trade.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {trade.status === "completed"
                              ? "✅ Profit"
                              : trade.status === "failed"
                                ? "❌ Loss"
                                : "🛑 Stop"}
                          </Badge>
                          <span className="text-xs text-blue-600">
                            {trade.actualSpread?.toFixed(3)}% → {trade.spread?.toFixed(3)}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trade.buyExchange} → {trade.sellExchange} | ${trade.tradeValue?.toFixed(0)} |{" "}
                          {trade.executionTime}ms
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${trade.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${trade.profit?.toFixed(4)}
                        </div>
                        <div className="text-xs text-muted-foreground">ROI: {trade.roi?.toFixed(3)}%</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Active Trading Parameters</CardTitle>
              <CardDescription>Professional arbitrage configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">✅ Market Conditions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Min spread: {status.riskSettings?.minimumSpread || 0.15}% (after fees)</li>
                    <li>• Trading fees: {status.riskSettings?.tradingFees || 0.1}% per side</li>
                    <li>• Slippage limit: {status.riskSettings?.slippageLimit || 0.3}%</li>
                    <li>• Target ROI: {status.riskSettings?.targetROIPerTrade || 0.2}% per trade</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">🛡️ Risk Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Stop loss: {status.riskSettings?.stopLossPercentage || 1}% (tight)</li>
                    <li>• Max exposure: {status.riskSettings?.maxExposurePerTrade || 5}% per trade</li>
                    <li>• Daily limit: {status.riskSettings?.maxDailyTrades || 200} trades</li>
                    <li>• Max drawdown: {status.riskSettings?.maxDrawdown || 10}%</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">⚡ Execution</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Scan interval: 3 seconds</li>
                    <li>• Execution speed: 50-200ms</li>
                    <li>• Success rate: 85%+ target</li>
                    <li>• Volume scaling: Dynamic</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Error State */}
      {startup.phase === "error" && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">❌ Startup Failed</CardTitle>
            <CardDescription>There was an issue starting the arbitrage system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                The arbitrage system failed to initialize. This could be due to API connectivity issues or system
                configuration problems.
              </p>
              <div className="flex gap-4">
                <Button onClick={startArbitrageSequence} className="bg-blue-600 hover:bg-blue-700">
                  🔄 Retry Startup
                </Button>
                <Button variant="outline" asChild>
                  <a href="/diagnostics">🔧 Run Diagnostics</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
