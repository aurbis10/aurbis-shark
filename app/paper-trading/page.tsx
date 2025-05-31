"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Settings, RotateCcw } from "lucide-react"

interface ArbitrageOpportunity {
  symbol: string
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  spread: number
  spreadPercent: number
  volume: number
  confidence: number
  riskLevel: "Low" | "Medium" | "High"
  timestamp: number
}

interface PaperTrade {
  id: string
  symbol: string
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  amount: number
  expectedProfit: number
  actualProfit: number
  status: "pending" | "executed" | "failed"
  timestamp: number
  executionTime?: number
  slippage: number
  fees: number
}

interface PaperTradingStats {
  totalTrades: number
  successfulTrades: number
  failedTrades: number
  totalProfit: number
  totalFees: number
  successRate: number
  averageProfit: number
  riskExposure: number
}

interface TradingSettings {
  stakePerTrade: number
  maxConcurrentTrades: number
  maxDailyTrades: number
  maxRiskPerTrade: number
  minSpreadThreshold: number
}

interface TradingStatus {
  isRunning: boolean
  isConnected: boolean
  currentOpportunities: ArbitrageOpportunity[]
  recentTrades: PaperTrade[]
  stats: PaperTradingStats
  virtualBalance: number
  settings: TradingSettings
}

export default function PaperTradingPage() {
  const [status, setStatus] = useState<TradingStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [tempSettings, setTempSettings] = useState<TradingSettings | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/paper-trading/status")
      const data = await response.json()

      if (data.success) {
        setStatus(data.data)
        if (!tempSettings) {
          setTempSettings(data.data.settings)
        }
        setError(null)
      } else {
        setError(data.message || "Failed to fetch status")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error fetching status:", err)
    }
  }

  const startTrading = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/paper-trading/start", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.message || "Failed to start trading")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error starting trading:", err)
    } finally {
      setLoading(false)
    }
  }

  const stopTrading = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/paper-trading/stop", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.message || "Failed to stop trading")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error stopping trading:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async () => {
    if (!tempSettings) return

    setLoading(true)
    try {
      const response = await fetch("/api/paper-trading/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempSettings),
      })
      const data = await response.json()

      if (data.success) {
        await fetchStatus()
        setShowSettings(false)
      } else {
        setError(data.message || "Failed to update settings")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error updating settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetBalance = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/paper-trading/reset", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.message || "Failed to reset balance")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error resetting balance:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    // Auto-refresh when trading is active
    const interval = setInterval(() => {
      if (status?.isRunning) {
        fetchStatus()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status?.isRunning])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-600 text-white border-green-600"
      case "Medium":
        return "bg-yellow-600 text-white border-yellow-600"
      case "High":
        return "bg-red-600 text-white border-red-600"
      default:
        return "bg-gray-600 text-white border-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "executed":
        return "bg-green-600 text-white border-green-600"
      case "pending":
        return "bg-blue-600 text-white border-blue-600"
      case "failed":
        return "bg-red-600 text-white border-red-600"
      default:
        return "bg-gray-600 text-white border-gray-600"
    }
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-500"
    if (profit < 0) return "text-red-500"
    return "text-gray-400"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Paper Trading</h1>
          <p className="text-gray-400 text-sm">Real market data • Virtual 100 USDT • Zero risk</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">TRADING CONTROL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Status:</span>
                <Badge
                  className={
                    status?.isRunning
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-600 text-white border-gray-600"
                  }
                >
                  {status?.isRunning ? "ACTIVE" : "STOPPED"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Market Data:</span>
                <Badge
                  className={
                    status?.isConnected
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-red-600 text-white border-red-600"
                  }
                >
                  {status?.isConnected ? "CONNECTED" : "DISCONNECTED"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              {status && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Balance:</span>
                    <span className={`text-lg font-bold ${getProfitColor(status.virtualBalance - 100)}`}>
                      {formatCurrency(status.virtualBalance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">P&L:</span>
                    <span className={`font-bold ${getProfitColor(status.virtualBalance - 100)}`}>
                      {status.virtualBalance >= 100 ? "+" : ""}
                      {formatCurrency(status.virtualBalance - 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Stake/Trade:</span>
                    <span className="text-white font-bold">{formatCurrency(status.settings.stakePerTrade)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            {status?.isRunning ? (
              <Button onClick={stopTrading} disabled={loading} className="bg-red-600 hover:bg-red-700">
                STOP TRADING
              </Button>
            ) : (
              <Button onClick={startTrading} disabled={loading} className="bg-green-600 hover:bg-green-700">
                START TRADING
              </Button>
            )}
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Settings className="h-4 w-4 mr-1" />
              SETTINGS
            </Button>
            <Button
              onClick={resetBalance}
              disabled={loading}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              RESET
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && tempSettings && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">TRADING SETTINGS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Stake per Trade (USDT)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.1"
                  value={tempSettings.stakePerTrade}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, stakePerTrade: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Concurrent Trades</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempSettings.maxConcurrentTrades}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, maxConcurrentTrades: Number.parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Daily Trades</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={tempSettings.maxDailyTrades}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, maxDailyTrades: Number.parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Spread Threshold (%)</label>
                <input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.01"
                  value={tempSettings.minSpreadThreshold}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, minSpreadThreshold: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={updateSettings} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                SAVE SETTINGS
              </Button>
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                CANCEL
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Dashboard */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs">TOTAL TRADES</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">{status.stats.totalTrades}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs">TOTAL P&L</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${getProfitColor(status.stats.totalProfit)}`}>
                {formatCurrency(status.stats.totalProfit)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs">WIN RATE</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">{status.stats.successRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">
                {status.stats.successfulTrades}W / {status.stats.failedTrades}L
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs">AVG PROFIT</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${getProfitColor(status.stats.averageProfit)}`}>
                {formatCurrency(status.stats.averageProfit)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Opportunities */}
      {status && status.currentOpportunities.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">LIVE OPPORTUNITIES</CardTitle>
            <CardDescription className="text-gray-400 text-xs">Real-time arbitrage opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.currentOpportunities.slice(0, 8).map((opp, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white">{opp.symbol}</span>
                    <span className="text-gray-400">
                      {opp.buyExchange} → {opp.sellExchange}
                    </span>
                    <Badge className={getRiskColor(opp.riskLevel)}>{opp.riskLevel}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+{opp.spreadPercent.toFixed(3)}%</div>
                    <div className="text-xs text-gray-400">{formatCurrency(opp.spread)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Trades */}
      {status && status.recentTrades.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">RECENT TRADES</CardTitle>
            <CardDescription className="text-gray-400 text-xs">Last 10 executed trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.recentTrades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white">{trade.symbol}</span>
                    <span className="text-gray-400">
                      {trade.buyExchange} → {trade.sellExchange}
                    </span>
                    <Badge className={getStatusColor(trade.status)}>{trade.status.toUpperCase()}</Badge>
                    <span className="text-xs text-gray-500">{formatTime(trade.timestamp)}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getProfitColor(trade.actualProfit)}`}>
                      {trade.actualProfit >= 0 ? "+" : ""}
                      {formatCurrency(trade.actualProfit)}
                    </div>
                    <div className="text-xs text-gray-400">{formatCurrency(trade.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {status && !status.isRunning && status.currentOpportunities.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Start Paper Trading</h3>
              <p className="text-gray-400 text-sm">
                Click "START TRADING" to begin scanning for arbitrage opportunities with virtual money.
              </p>
              <p className="text-xs text-gray-500">
                Current stake: {status?.settings ? formatCurrency(status.settings.stakePerTrade) : "$5.00"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
