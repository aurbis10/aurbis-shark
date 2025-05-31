"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TradingStats {
  totalTrades: number
  successfulTrades: number
  failedTrades: number
  stopLossHits: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  roi: number
  maxDrawdown: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  sharpeRatio: number
  averageROIPerTrade: number
  totalVolume: number
}

interface TradingStatus {
  isRunning: boolean
  dailyTradeCount: number
  maxDailyTrades: number
  accountBalance: number
  currentBalance: number
  stats: TradingStats
  riskSettings: any
}

export default function ContinuousDemoPage() {
  const [status, setStatus] = useState<TradingStatus | null>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/demo-trading/status")
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
        setTrades(data.recentTrades || [])
      }
    } catch (error) {
      console.error("Failed to fetch status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startTrading = async () => {
    try {
      const response = await fetch("/api/demo-trading/start", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        await fetchStatus()
      }
    } catch (error) {
      console.error("Failed to start trading:", error)
    }
  }

  const stopTrading = async () => {
    try {
      const response = await fetch("/api/demo-trading/stop", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        await fetchStatus()
      }
    } catch (error) {
      console.error("Failed to stop trading:", error)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 2000) // Update every 2 seconds for arbitrage
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (tradeStatus: string) => {
    switch (tradeStatus) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">✅ Profit</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">❌ Loss</Badge>
      case "stopped_loss":
        return <Badge className="bg-orange-100 text-orange-800">🛑 Stop Loss</Badge>
      default:
        return <Badge variant="secondary">⏳ Pending</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Realistic Arbitrage Trading</h1>
          <p className="text-muted-foreground">Loading trading system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🔄 Realistic Arbitrage Trading</h1>
        <p className="text-muted-foreground">
          Professional arbitrage simulation with realistic spreads (0.15%-0.8%) and ROI (0.1%-0.5% per trade)
        </p>
      </div>

      {/* Trading Controls */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ High-Frequency Arbitrage Control</CardTitle>
          <CardDescription>Professional arbitrage trading with realistic market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Button onClick={startTrading} disabled={status?.isRunning} className="bg-green-600 hover:bg-green-700">
              {status?.isRunning ? "🟢 Arbitrage Active" : "▶️ Start Arbitrage"}
            </Button>
            <Button onClick={stopTrading} disabled={!status?.isRunning} variant="destructive">
              ⏹️ Stop Trading
            </Button>
            <Badge variant={status?.isRunning ? "default" : "secondary"}>
              {status?.isRunning ? "🔄 Scanning Markets" : "⏸️ Stopped"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Daily: {status?.dailyTradeCount || 0}/{status?.maxDailyTrades || 200}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Key Arbitrage Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${status?.currentBalance?.toFixed(2) || "0.00"}</div>
            <div className="text-xs text-muted-foreground">
              P&L: ${(status?.currentBalance! - status?.accountBalance!)?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{status?.stats?.winRate?.toFixed(1) || "0.0"}%</div>
            <div className="text-xs text-muted-foreground">
              {status?.stats?.successfulTrades || 0}/{status?.stats?.totalTrades || 0} profitable
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI/Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {status?.stats?.averageROIPerTrade?.toFixed(3) || "0.000"}%
            </div>
            <div className="text-xs text-muted-foreground">Per trade return</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${(status?.stats?.totalVolume / 1000)?.toFixed(1) || "0.0"}K
            </div>
            <div className="text-xs text-muted-foreground">Traded volume</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{status?.stats?.profitFactor?.toFixed(2) || "0.00"}</div>
            <div className="text-xs text-muted-foreground">Win/Loss ratio</div>
          </CardContent>
        </Card>
      </div>

      {/* Arbitrage Performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trade Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Profitable:</span>
                <span className="text-green-600 font-medium">{status?.stats?.successfulTrades || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Failed:</span>
                <span className="text-red-600 font-medium">{status?.stats?.failedTrades || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Stop Loss:</span>
                <span className="text-orange-600 font-medium">{status?.stats?.stopLossHits || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Avg Win:</span>
                <span className="text-green-600 font-medium">${status?.stats?.averageWin?.toFixed(4) || "0.0000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Loss:</span>
                <span className="text-red-600 font-medium">${status?.stats?.averageLoss?.toFixed(4) || "0.0000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Net P&L:</span>
                <span
                  className={`font-medium ${(status?.stats?.netProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${status?.stats?.netProfit?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Min Spread:</span>
                <span className="font-medium">{status?.riskSettings?.minimumSpread || 0.15}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Stop Loss:</span>
                <span className="font-medium">{status?.riskSettings?.stopLossPercentage || 1}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Max Drawdown:</span>
                <span
                  className={`font-medium ${(status?.stats?.maxDrawdown || 0) > 5 ? "text-red-600" : "text-green-600"}`}
                >
                  {status?.stats?.maxDrawdown?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Arbitrage Trades */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Recent Arbitrage Opportunities</CardTitle>
          <CardDescription>Real-time arbitrage execution with realistic spreads and fees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trades.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No arbitrage opportunities yet. Start trading to see results.
              </p>
            ) : (
              trades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trade.symbol}</span>
                      {getStatusBadge(trade.status)}
                      <span className="text-xs text-blue-600">
                        Spread: {trade.actualSpread?.toFixed(3)}% → {trade.spread?.toFixed(3)}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.buyExchange} → {trade.sellExchange} | Volume: ${trade.tradeValue?.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Buy: ${trade.buyPrice?.toFixed(2)} | Sell: ${trade.sellPrice?.toFixed(2)}
                      {trade.executionTime && ` | ${trade.executionTime}ms`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${trade.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${trade.profit?.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">ROI: {trade.roi?.toFixed(3)}%</div>
                    <div className="text-xs text-orange-600">Risk: ${trade.riskAmount?.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Realistic Arbitrage Info */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Realistic Arbitrage Parameters</CardTitle>
          <CardDescription>Professional arbitrage trading simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Market Conditions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum spread: {status?.riskSettings?.minimumSpread || 0.15}% (after fees)</li>
                <li>• Trading fees: {status?.riskSettings?.tradingFees || 0.1}% per side (0.2% total)</li>
                <li>• Slippage limit: {status?.riskSettings?.slippageLimit || 0.3}%</li>
                <li>• Target ROI: {status?.riskSettings?.targetROIPerTrade || 0.2}% per trade</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Risk Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stop loss: {status?.riskSettings?.stopLossPercentage || 1}% (tight for arbitrage)</li>
                <li>• Max exposure: {status?.riskSettings?.maxExposurePerTrade || 5}% per trade</li>
                <li>• Daily limit: {status?.riskSettings?.maxDailyTrades || 200} trades</li>
                <li>• Execution speed: 50-200ms (realistic latency)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Realistic Arbitrage:</strong> This simulation uses real-world parameters where profits come
              from volume and frequency, not large individual returns. Typical arbitrage ROI is 0.1%-0.5% per trade with
              85%+ win rates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
