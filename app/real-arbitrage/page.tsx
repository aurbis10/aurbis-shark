"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RealArbitragePage() {
  const [status, setStatus] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [balances, setBalances] = useState<any>({})
  const [exchangeDetails, setExchangeDetails] = useState<any>({})
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExchange, setSelectedExchange] = useState<string>("all")

  const startRealArbitrage = async () => {
    setIsStarting(true)
    setError(null)

    try {
      const response = await fetch("/api/real-arbitrage/start", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        console.log("✅ Real arbitrage system started!")
        await fetchStatus()
        await fetchBalances()
        await fetchExchangeDetails()
      } else {
        throw new Error(data.error || "Failed to start real arbitrage")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
      console.error("❌ Failed to start real arbitrage:", error)
    } finally {
      setIsStarting(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/real-arbitrage/status")
      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
        setTrades(data.recentTrades || [])
      }
    } catch (error) {
      console.error("Failed to fetch status:", error)
    }
  }

  const fetchBalances = async () => {
    try {
      const response = await fetch("/api/real-arbitrage/balances")
      const data = await response.json()

      setBalances(data)
    } catch (error) {
      console.error("Failed to fetch balances:", error)
    }
  }

  const fetchExchangeDetails = async () => {
    try {
      const response = await fetch("/api/real-arbitrage/exchange-details")
      const data = await response.json()

      if (data.success) {
        setExchangeDetails(data)
      }
    } catch (error) {
      console.error("Failed to fetch exchange details:", error)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await Promise.allSettled([fetchStatus(), fetchBalances(), fetchExchangeDetails()])
    }

    initializeData()

    const interval = setInterval(async () => {
      await Promise.allSettled([fetchStatus(), fetchBalances(), fetchExchangeDetails()])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getExchangeIcon = (exchange: string) => {
    const icons = {
      binance: "🟡",
      bybit: "🟠",
      okx: "⚫",
    }
    return icons[exchange as keyof typeof icons] || "🔵"
  }

  const getCredentialStatus = (exchange: any) => {
    if (!exchange.credentials) return "❓ Unknown"

    const { hasApiKey, hasSecret, hasPassphrase } = exchange.credentials
    const requiredFields = exchange.exchange === "okx" ? 3 : 2
    const availableFields = [hasApiKey, hasSecret, hasPassphrase].filter(Boolean).length

    if (availableFields === requiredFields) {
      return "✅ Complete"
    } else if (availableFields > 0) {
      return "⚠️ Partial"
    } else {
      return "❌ Missing"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🔴 REAL Arbitrage Trading</h1>
        <p className="text-muted-foreground">Individual exchange tracking with OKX demo activity simulation</p>
      </div>

      {/* Exchange Selection */}
      <Card>
        <CardHeader>
          <CardTitle>🏦 Exchange Selection</CardTitle>
          <CardDescription>View individual exchange details and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedExchange === "all" ? "default" : "outline"}
              onClick={() => setSelectedExchange("all")}
              size="sm"
            >
              All Exchanges
            </Button>
            {exchangeDetails?.exchanges?.map((exchange: any) => (
              <Button
                key={exchange.exchange}
                variant={selectedExchange === exchange.exchange ? "default" : "outline"}
                onClick={() => setSelectedExchange(exchange.exchange)}
                size="sm"
              >
                {getExchangeIcon(exchange.exchange)} {exchange.exchange.toUpperCase()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Exchange Details */}
      {exchangeDetails?.exchanges && (
        <div className="grid gap-4 md:grid-cols-1">
          {exchangeDetails.exchanges
            .filter((exchange: any) => selectedExchange === "all" || selectedExchange === exchange.exchange)
            .map((exchange: any) => (
              <Card
                key={exchange.exchange}
                className={`border-2 ${
                  exchange.exchange === "okx"
                    ? "border-black"
                    : exchange.exchange === "binance"
                      ? "border-yellow-400"
                      : "border-orange-400"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getExchangeIcon(exchange.exchange)}
                      {exchange.exchange.toUpperCase()}
                      {exchange.exchange === "okx" && <Badge variant="outline">DEMO ACCOUNT</Badge>}
                      {exchange.exchange !== "okx" && <Badge variant="outline">TESTNET</Badge>}
                    </span>
                    <div className="flex gap-2">
                      <Badge variant={exchange.connectionStatus === "connected" ? "default" : "secondary"}>
                        {exchange.connectionStatus}
                      </Badge>
                      <Badge variant="outline">{getCredentialStatus(exchange)}</Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {exchange.exchange === "okx"
                      ? "OKX Demo Trading Account - Simulated activity for demonstration"
                      : `${exchange.exchange.charAt(0).toUpperCase() + exchange.exchange.slice(1)} Testnet Account`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Total Balance</div>
                      <div className="text-xl font-bold text-green-600">
                        ${exchange.totalUsdBalance?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Available</div>
                      <div className="text-xl font-bold text-blue-600">
                        ${exchange.availableUsdBalance?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-700 font-medium">Total Trades</div>
                      <div className="text-xl font-bold text-purple-600">{exchange.tradeCount || 0}</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="text-sm text-amber-700 font-medium">Last Activity</div>
                      <div className="text-lg font-bold text-amber-600">
                        {exchange.lastTradeTime ? new Date(exchange.lastTradeTime).toLocaleTimeString() : "No trades"}
                      </div>
                    </div>
                  </div>

                  {/* Asset Balances */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Asset Balances</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {exchange.balances?.slice(0, 6).map((balance: any) => (
                        <div key={balance.asset} className="flex justify-between items-center p-2 border rounded">
                          <span className="font-medium">{balance.asset}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {balance.total.toFixed(balance.asset === "USDT" ? 2 : 6)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${balance.usdValue?.toFixed(2) || "0.00"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Trades */}
                  {exchange.recentTrades && exchange.recentTrades.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recent Trades</h4>
                      <div className="space-y-2">
                        {exchange.recentTrades.slice(0, 3).map((trade: any) => (
                          <div key={trade.orderId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{trade.symbol}</span>
                              <Badge variant="outline" className="ml-2">
                                {trade.side}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {trade.quantity.toFixed(6)} @ ${trade.price.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(trade.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OKX Demo Notice */}
                  {exchange.exchange === "okx" && (
                    <div className="mt-4 p-3 bg-black text-white rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚫</span>
                        <span className="font-medium">OKX Demo Account Status</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        This is your OKX demo trading account. Trades are simulated but use realistic market data.
                        {exchange.tradeCount > 0
                          ? ` You have executed ${exchange.tradeCount} demo trades.`
                          : " Demo trading activity will appear here."}
                      </p>
                      {exchange.credentials?.hasApiKey && (
                        <p className="text-xs text-green-300 mt-1">✅ API credentials configured for demo trading</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Summary Stats */}
      {exchangeDetails?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Portfolio Summary</CardTitle>
            <CardDescription>Combined statistics across all exchanges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 font-medium">Total Portfolio</div>
                <div className="text-2xl font-bold text-green-600">
                  ${exchangeDetails.summary.totalBalance?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-muted-foreground">Across all exchanges</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-medium">Total Trades</div>
                <div className="text-2xl font-bold text-blue-600">{exchangeDetails.summary.totalTrades || 0}</div>
                <div className="text-xs text-muted-foreground">All exchanges combined</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700 font-medium">Active Exchanges</div>
                <div className="text-2xl font-bold text-purple-600">{exchangeDetails.summary.totalExchanges || 0}</div>
                <div className="text-xs text-muted-foreground">Connected accounts</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="text-sm text-amber-700 font-medium">Last Activity</div>
                <div className="text-lg font-bold text-amber-600">
                  {exchangeDetails.summary.lastActivity
                    ? new Date(exchangeDetails.summary.lastActivity).toLocaleTimeString()
                    : "No activity"}
                </div>
                <div className="text-xs text-muted-foreground">Most recent trade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Control */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status?.isConnected ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600">ACTIVE - Individual Exchange Tracking</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-600">Ready to Start</span>
              </>
            )}
          </CardTitle>
          <CardDescription>Enhanced system with individual exchange balance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {!status?.isRunning ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Start the enhanced arbitrage system with individual exchange tracking and OKX demo activity simulation.
              </p>
              <Button onClick={startRealArbitrage} disabled={isStarting} className="bg-red-600 hover:bg-red-700">
                {isStarting ? "🔄 Starting Enhanced System..." : "🚀 Start Enhanced Arbitrage"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-3 bg-green-50 rounded-md">
                <div className="text-sm text-green-700 font-medium">System Status</div>
                <div className="text-xl font-bold text-green-600">ACTIVE</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-700 font-medium">Exchanges</div>
                <div className="text-xl font-bold text-blue-600">{exchangeDetails?.summary?.totalExchanges || 3}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md">
                <div className="text-sm text-purple-700 font-medium">Total Trades</div>
                <div className="text-xl font-bold text-purple-600">{status.totalTrades || 0}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-md">
                <div className="text-sm text-amber-700 font-medium">Win Rate</div>
                <div className="text-xl font-bold text-amber-600">{status.winRate?.toFixed(1) || "0.0"}%</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
