"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ForceArbitragePage() {
  const [isStarting, setIsStarting] = useState(true)
  const [isStarted, setIsStarted] = useState(false)
  const [status, setStatus] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tradeCount, setTradeCount] = useState(0)

  const forceStartArbitrage = async () => {
    try {
      setIsStarting(true)
      setError(null)

      const response = await fetch("/api/arbitrage/force-start", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setIsStarted(true)
        setStatus(data.status)
      } else {
        throw new Error(data.error || "Failed to start arbitrage")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsStarting(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/demo-trading/status")
      const data = await response.json()

      if (data.success) {
        setStatus(data.status)

        // Check if new trades have been added
        if (data.recentTrades && data.recentTrades.length > 0) {
          setTrades(data.recentTrades)

          // Update trade count if it has increased
          if (data.recentTrades.length > tradeCount) {
            setTradeCount(data.recentTrades.length)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch status:", error)
    }
  }

  useEffect(() => {
    // Force start arbitrage immediately when page loads
    forceStartArbitrage()

    // Set up polling for status updates
    const interval = setInterval(fetchStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">⚡ Active Arbitrage Trading</h1>
        <p className="text-muted-foreground">High-frequency arbitrage trading with guaranteed execution</p>
      </div>

      {/* Status Card */}
      <Card className={`border-2 ${isStarted ? "border-green-300" : "border-blue-300"}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isStarting ? (
                <span className="animate-pulse">🔄 Starting Arbitrage System...</span>
              ) : isStarted ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">ACTIVE TRADING</span>
                </>
              ) : (
                <span className="text-red-600">❌ Not Running</span>
              )}
            </CardTitle>
            <Badge variant={isStarted ? "default" : "outline"}>{isStarted ? "Live Trading" : "Initializing"}</Badge>
          </div>
          <CardDescription>
            {isStarted
              ? "Arbitrage system is actively finding and executing trades"
              : "Starting high-frequency arbitrage system..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">Error: {error}</p>
              <Button onClick={forceStartArbitrage} className="mt-2 bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
            </div>
          ) : isStarted && status ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-700 font-medium">Account Balance</div>
                  <div className="text-xl font-bold text-blue-600">${status.currentBalance?.toFixed(2) || "0.00"}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <div className="text-sm text-green-700 font-medium">Win Rate</div>
                  <div className="text-xl font-bold text-green-600">{status.stats?.winRate?.toFixed(1) || "0.0"}%</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-md">
                  <div className="text-sm text-purple-700 font-medium">Trades Today</div>
                  <div className="text-xl font-bold text-purple-600">
                    {status.dailyTradeCount || 0}/{status.maxDailyTrades || 300}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-md">
                  <div className="text-sm text-amber-700 font-medium">Avg ROI/Trade</div>
                  <div className="text-xl font-bold text-amber-600">
                    {status.stats?.averageROIPerTrade?.toFixed(3) || "0.000"}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Trading at <span className="font-medium">1-second intervals</span> with{" "}
                  <span className="font-medium">0.12%</span> minimum spread
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href="/continuous-demo">View Full Dashboard</a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Trade Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>⚡ Live Arbitrage Feed</span>
            <Badge variant="outline">{trades.length} trades</Badge>
          </CardTitle>
          <CardDescription>Real-time arbitrage executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {trades.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-muted-foreground">Executing first trades...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The system is actively finding arbitrage opportunities
                  </p>
                </div>
              </div>
            ) : (
              trades.slice(0, 10).map((trade) => (
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
                        {trade.status === "completed" ? "✅ Profit" : trade.status === "failed" ? "❌ Loss" : "🛑 Stop"}
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

      {/* Active Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Active Trading Parameters</CardTitle>
          <CardDescription>Aggressive arbitrage configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">✅ Market Conditions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Min spread: 0.12% (after fees)</li>
                <li>• Trading fees: 0.1% per side</li>
                <li>• Slippage limit: 0.2%</li>
                <li>• Target ROI: 0.2% per trade</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">🛡️ Risk Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stop loss: 1% (tight)</li>
                <li>• Max exposure: 5% per trade</li>
                <li>• Daily limit: 300 trades</li>
                <li>• Max drawdown: 10%</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700">⚡ Execution</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scan interval: 1 second</li>
                <li>• Execution speed: 50-200ms</li>
                <li>• Success rate: 85%+ target</li>
                <li>• Guaranteed execution: Active</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
