"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Play, Square, AlertTriangle, Settings } from "lucide-react"

export default function RealMoneyTradingPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [balances, setBalances] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Helper function to safely parse JSON responses
  const safeJsonParse = async (response: Response) => {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse JSON:", text)
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`)
    }
  }

  // Fetch trading status
  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/real-money-trading/status")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await safeJsonParse(response)

      if (data.success) {
        setIsRunning(data.isRunning)
        setStatus(data.status)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch trading status")
      }
    } catch (err) {
      console.error("Status fetch error:", err)
      setError(err instanceof Error ? err.message : "Error connecting to server")
    }
  }

  // Fetch balances
  const fetchBalances = async () => {
    try {
      const response = await fetch("/api/real-money-trading/balances")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await safeJsonParse(response)

      if (data.success) {
        setBalances(data.balances)
      } else {
        console.error("Balance fetch failed:", data.error)
      }
    } catch (err) {
      console.error("Balance fetch error:", err)
      // Don't set main error for balance failures, just log them
    }
  }

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchStatus()
      await fetchBalances()
      setIsLoading(false)
    }

    loadData()

    // Poll for status updates every 5 seconds
    const statusInterval = setInterval(fetchStatus, 5000)

    // Poll for balance updates every 10 seconds
    const balanceInterval = setInterval(fetchBalances, 10000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(balanceInterval)
    }
  }, [])

  // Start trading
  const startTrading = async () => {
    try {
      setError(null)
      const response = await fetch("/api/real-money-trading/start", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await safeJsonParse(response)

      if (data.success) {
        setIsRunning(true)
        await fetchStatus()
      } else {
        setError(data.error || "Failed to start trading")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error connecting to server")
    }
  }

  // Stop trading
  const stopTrading = async () => {
    try {
      setError(null)
      const response = await fetch("/api/real-money-trading/stop", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await safeJsonParse(response)

      if (data.success) {
        setIsRunning(false)
        await fetchStatus()
      } else {
        setError(data.error || "Failed to stop trading")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error connecting to server")
    }
  }

  // Emergency stop
  const emergencyStop = async () => {
    if (!confirm("Are you sure you want to execute an emergency stop?")) {
      return
    }

    try {
      setError(null)
      const response = await fetch("/api/real-money-trading/emergency-stop", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await safeJsonParse(response)

      if (data.success) {
        setIsRunning(false)
        await fetchStatus()
      } else {
        setError(data.error || "Failed to execute emergency stop")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error connecting to server")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-red-500">💰 REAL MONEY TRADING</h1>
        <p className="text-gray-400">
          <strong className="text-red-400">WARNING:</strong> This system uses actual funds from your exchange accounts
        </p>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-4">
            <div className="flex items-center text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              {isRunning ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">🟢 TRADING ACTIVE</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">Trading Stopped</span>
                </>
              )}
            </span>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showSettings ? "Hide Settings" : "Settings"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            {!isRunning ? (
              <Button onClick={startTrading} disabled={isLoading} className="bg-green-600 hover:bg-green-700" size="lg">
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "Start Trading"}
              </Button>
            ) : (
              <Button
                onClick={stopTrading}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700"
                size="lg"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Trading
              </Button>
            )}

            <Button onClick={emergencyStop} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Balance Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">💰 Account Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {balances ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-3 bg-green-900 rounded-lg border border-green-700">
                  <div className="text-sm text-green-400 font-medium">TOTAL BALANCE</div>
                  <div className="text-2xl font-mono font-bold text-white">${balances.total?.toFixed(2) || "0.00"}</div>
                </div>
                <div className="p-3 bg-blue-900 rounded-lg border border-blue-700">
                  <div className="text-sm text-blue-400 font-medium">AVAILABLE</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    ${balances.available?.toFixed(2) || "0.00"}
                  </div>
                </div>
              </div>

              {balances.exchanges && (
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(balances.exchanges).map(([exchange, balance]: [string, any]) => (
                    <div key={exchange} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400 font-medium">{exchange.toUpperCase()}</div>
                      <div className="text-lg font-mono font-bold text-white">
                        ${typeof balance === "number" ? balance.toFixed(2) : "0.00"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-gray-400">Loading balance information...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trading Statistics */}
      {status && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Trading Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 font-medium">TOTAL TRADES</div>
                <div className="text-2xl font-mono font-bold text-white">{status.totalTrades || 0}</div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 font-medium">SUCCESSFUL</div>
                <div className="text-2xl font-mono font-bold text-white">{status.successfulTrades || 0}</div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 font-medium">TOTAL PROFIT</div>
                <div
                  className={`text-2xl font-mono font-bold ${(status.totalProfit || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  ${(status.totalProfit || 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 font-medium">CONNECTION</div>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${status.isConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-white">{status.isConnected ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">⚙️ Trading Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-gray-400">Settings panel will be implemented here</p>
              <p className="text-xs text-gray-500 mt-1">Configure risk parameters, trading pairs, and other settings</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
