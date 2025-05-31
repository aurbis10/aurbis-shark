"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LiveTradingPage() {
  const [status, setStatus] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [trades, setTrades] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any>({})
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const startLiveTrading = async () => {
    setIsStarting(true)
    try {
      const response = await fetch("/api/live-trading/start", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        console.log("✅ Live trading started!")
        await fetchStatus()
      } else {
        console.error("❌ Failed to start:", data.error)
      }
    } catch (error) {
      console.error("❌ Error starting live trading:", error)
    } finally {
      setIsStarting(false)
    }
  }

  const stopLiveTrading = async () => {
    setIsStopping(true)
    try {
      const response = await fetch("/api/live-trading/stop", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        console.log("⏹️ Live trading stopped")
        await fetchStatus()
      }
    } catch (error) {
      console.error("❌ Error stopping live trading:", error)
    } finally {
      setIsStopping(false)
    }
  }

  const scanOpportunities = async () => {
    setIsScanning(true)
    try {
      const response = await fetch("/api/live-trading/opportunities")
      const data = await response.json()

      if (data.success) {
        setOpportunities(data.opportunities)
        setMarketData(data.marketData)
        console.log(`🔍 Found ${data.totalOpportunities} opportunities`)
      }
    } catch (error) {
      console.error("❌ Error scanning opportunities:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/live-trading/status")
      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
        setOpportunities(data.opportunities)
        setTrades(data.trades)
        setMarketData(data.marketData)
      }
    } catch (error) {
      console.error("❌ Error fetching status:", error)
    }
  }

  useEffect(() => {
    fetchStatus()

    // Auto-refresh every 3 seconds when live trading is active
    const interval = setInterval(() => {
      if (status?.isRunning) {
        fetchStatus()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status?.isRunning])

  const getOpportunityBadge = (opportunity: any) => {
    if (opportunity.netSpread > 0.5) return <Badge className="bg-green-100 text-green-800">🟢 Excellent</Badge>
    if (opportunity.netSpread > 0.3) return <Badge className="bg-blue-100 text-blue-800">🔵 Good</Badge>
    if (opportunity.netSpread > 0.15) return <Badge className="bg-yellow-100 text-yellow-800">🟡 Fair</Badge>
    return <Badge variant="outline">⚪ Low</Badge>
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">⚡ LIVE Arbitrage Trading</h1>
        <p className="text-muted-foreground">Real-time opportunity scanning and automatic trade execution</p>
      </div>

      {/* Live Trading Control */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {status?.isRunning ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">LIVE TRADING ACTIVE</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">Trading Stopped</span>
                </>
              )}
            </span>
            <div className="flex gap-2">
              {status?.isScanning && <Badge className="bg-blue-100 text-blue-800 animate-pulse">🔍 Scanning</Badge>}
              <Badge variant="outline">{status?.scanInterval || 2000}ms intervals</Badge>
            </div>
          </CardTitle>
          <CardDescription>
            {status?.isRunning
              ? "System is actively scanning markets and executing profitable arbitrage trades"
              : "Start live trading to begin real-time opportunity detection and execution"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            {!status?.isRunning ? (
              <Button
                onClick={startLiveTrading}
                disabled={isStarting}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isStarting ? "🔄 Starting..." : "🚀 Start LIVE Trading"}
              </Button>
            ) : (
              <Button onClick={stopLiveTrading} disabled={isStopping} variant="destructive" size="lg">
                {isStopping ? "⏳ Stopping..." : "⏹️ Stop Trading"}
              </Button>
            )}

            <Button onClick={scanOpportunities} disabled={isScanning} variant="outline">
              {isScanning ? "🔄 Scanning..." : "🔍 Manual Scan"}
            </Button>

            <Button variant="outline" asChild>
              <a href="/continuous-demo">📊 View Demo Mode</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Statistics */}
      {status && (
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${status.accountBalance?.toFixed(2) || "0.00"}</div>
              <div className="text-xs text-muted-foreground">Profit: ${status.totalProfit?.toFixed(2) || "0.00"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{opportunities.length || 0}</div>
              <div className="text-xs text-muted-foreground">Currently available</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Executed Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{status.executedTrades || 0}</div>
              <div className="text-xs text-muted-foreground">Total completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{status.successRate?.toFixed(1) || "0.0"}%</div>
              <div className="text-xs text-muted-foreground">Trade success</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Risk Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${status.riskExposure?.toFixed(2) || "0.00"}</div>
              <div className="text-xs text-muted-foreground">Current risk</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-cyan-600">
                {status.lastScanTime ? new Date(status.lastScanTime).toLocaleTimeString() : "Never"}
              </div>
              <div className="text-xs text-muted-foreground">Latest update</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎯 Live Arbitrage Opportunities</span>
            <Badge variant="outline">{opportunities.length} detected</Badge>
          </CardTitle>
          <CardDescription>
            Real-time opportunities detected across exchanges - automatically executed when profitable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {opportunities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-muted-foreground">
                  {status?.isScanning ? "Scanning for opportunities..." : "No opportunities detected"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {status?.isRunning ? "System is actively monitoring markets" : "Start live trading to begin scanning"}
                </p>
              </div>
            ) : (
              opportunities.slice(0, 15).map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{opportunity.symbol}</span>
                      {getOpportunityBadge(opportunity)}
                      {getRiskBadge(opportunity.riskLevel)}
                      <Badge variant="outline" className="text-xs">
                        {opportunity.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {opportunity.buyExchange} → {opportunity.sellExchange} | Volume: {opportunity.volume?.toFixed(4)}{" "}
                      | Spread: {opportunity.netSpread?.toFixed(3)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Buy: ${opportunity.buyPrice?.toFixed(2)} | Sell: ${opportunity.sellPrice?.toFixed(2)} | Age:{" "}
                      {Math.round((Date.now() - opportunity.timestamp) / 1000)}s
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${opportunity.estimatedProfit?.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">Est. profit</div>
                    <Badge
                      variant={
                        opportunity.status === "completed"
                          ? "default"
                          : opportunity.status === "executing"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {opportunity.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Live Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>⚡ Recent Live Trades</span>
            <Badge variant="outline">{trades.length} executed</Badge>
          </CardTitle>
          <CardDescription>Automatically executed arbitrage trades with real-time results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {trades.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-muted-foreground">No trades executed yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Trades will appear here when profitable opportunities are executed
                </p>
              </div>
            ) : (
              trades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{trade.symbol}</span>
                      <Badge
                        className={
                          trade.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : trade.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : trade.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                        }
                      >
                        {trade.status}
                      </Badge>
                      <span className="text-xs text-blue-600">{trade.executionTime}ms</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.buyExchange} → {trade.sellExchange} | Qty: {trade.quantity?.toFixed(4)} | Fees: $
                      {trade.fees?.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Buy: ${trade.actualBuyPrice?.toFixed(2) || trade.buyPrice?.toFixed(2)} | Sell: $
                      {trade.actualSellPrice?.toFixed(2) || trade.sellPrice?.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${trade.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${trade.netProfit?.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">ROI: {trade.roi?.toFixed(3)}%</div>
                    <div className="text-xs text-gray-500">{new Date(trade.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Trading Features */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Live Trading Features</CardTitle>
          <CardDescription>Advanced arbitrage trading capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">✅ Real-Time Scanning</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 2-second market scanning intervals</li>
                <li>• Multi-exchange price monitoring</li>
                <li>• Instant opportunity detection</li>
                <li>• Live market data feeds</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">⚡ Automatic Execution</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sub-second trade execution</li>
                <li>• Risk-based opportunity filtering</li>
                <li>• Slippage protection</li>
                <li>• Concurrent trade management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700">🛡️ Risk Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1% stop loss protection</li>
                <li>• 5% max risk per trade</li>
                <li>• Daily trade limits (500)</li>
                <li>• Real-time exposure monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
