"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TradingRule {
  category: string
  name: string
  description: string
  priority: "high" | "medium" | "low"
}

interface EnhancedTradingStatus {
  isActive: boolean
  startTime: number | null
  totalOpportunities: number
  approvedTrades: number
  rejectedTrades: number
  executedTrades: number
  totalProfit: number
  successRate: number
  dailyTradeCount: number
  dailyPnL: number
  riskExposure: number
  activePositions: number
  lastRuleCheck: number
}

interface ExecutedTrade {
  id: string
  pair: string
  buyExchange: string
  sellExchange: string
  amount: number
  netProfit: number
  executionTime: number
  ruleScore: number
  trailingStopActive: boolean
}

interface TradingOpportunity {
  id: string
  pair: string
  buyExchange: string
  sellExchange: string
  spread: number
  confidence: number
  riskPercentage: number
  rewardPercentage: number
  timestamp: number
  ruleValidation?: {
    passed: boolean
    score: number
    recommendation: string
    failedRules: string[]
  }
}

export default function EnhancedTradingPage() {
  const [status, setStatus] = useState<EnhancedTradingStatus | null>(null)
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([])
  const [executedTrades, setExecutedTrades] = useState<ExecutedTrade[]>([])
  const [rules, setRules] = useState<Record<string, TradingRule[]>>({})
  const [ruleStats, setRuleStats] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRules()
    loadStatus()

    const interval = setInterval(() => {
      if (status?.isActive) {
        loadStatus()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status?.isActive])

  const loadRules = async () => {
    try {
      const response = await fetch("/api/enhanced-trading/rules")
      const data = await response.json()
      if (data.success) {
        setRules(data.rules)
      }
    } catch (error) {
      console.error("Failed to load rules:", error)
    }
  }

  const loadStatus = async () => {
    try {
      const response = await fetch("/api/enhanced-trading/status")
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
        setOpportunities(data.opportunities || [])
        setExecutedTrades(data.executedTrades || [])
        setRuleStats(data.ruleStats || {})
      }
    } catch (error) {
      console.error("Failed to load status:", error)
    }
  }

  const startTrading = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/enhanced-trading/start", {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
      }
    } catch (error) {
      console.error("Failed to start trading:", error)
    } finally {
      setLoading(false)
    }
  }

  const stopTrading = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/enhanced-trading/stop", {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
      }
    } catch (error) {
      console.error("Failed to stop trading:", error)
    } finally {
      setLoading(false)
    }
  }

  const emergencyStop = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/enhanced-trading/stop", {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        setStatus(data.status)
      }
    } catch (error) {
      console.error("Failed to emergency stop:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "execute":
        return <Badge className="bg-green-100 text-green-800">✅ Execute</Badge>
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Review</Badge>
      case "reject":
        return <Badge className="bg-red-100 text-red-800">❌ Reject</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 Enhanced Trading System</h1>
        <p className="text-xl text-gray-600">Professional Rules Engine with Institutional-Grade Risk Management</p>
      </div>

      {/* Trading Control */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Trading Control
            <div className="flex items-center space-x-2">
              {status?.isActive ? (
                <Badge className="bg-green-100 text-green-800">🟢 Active</Badge>
              ) : (
                <Badge variant="secondary">⚫ Stopped</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              onClick={startTrading}
              disabled={loading || status?.isActive}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Starting..." : "🚀 Start Enhanced Trading"}
            </Button>
            <Button onClick={stopTrading} disabled={loading || !status?.isActive} variant="outline">
              {loading ? "Stopping..." : "⏹️ Stop Trading"}
            </Button>
            <Button
              onClick={emergencyStop}
              disabled={loading || !status?.isActive}
              className="bg-red-600 hover:bg-red-700"
            >
              🚨 Emergency Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{status.totalOpportunities}</div>
              <p className="text-xs text-gray-500">Scanned opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{ruleStats.approvalRate?.toFixed(1) || 0}%</div>
              <p className="text-xs text-gray-500">Rules validation success</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${status.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${status.totalProfit.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Net profit (after costs)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{status.successRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">Execution success rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trading Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Trading Rules</CardTitle>
          <CardDescription>9-Category validation system with institutional-grade criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(rules).map(([category, categoryRules]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-semibold text-gray-900">{category}</h4>
                <div className="space-y-1">
                  {categoryRules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{rule.name}</div>
                        <div className="text-xs text-gray-500">{rule.description}</div>
                      </div>
                      {getPriorityBadge(rule.priority)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Live Opportunities & Rule Validation</CardTitle>
          <CardDescription>Real-time opportunities with professional rule validation results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {status?.isActive ? "Scanning for opportunities..." : "Start trading to see opportunities"}
              </p>
            ) : (
              opportunities.slice(0, 10).map((opp) => (
                <div key={opp.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{opp.pair}</span>
                      <span className="text-sm text-gray-500">
                        {opp.buyExchange} → {opp.sellExchange}
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">{opp.spread.toFixed(3)}% spread</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {opp.ruleValidation && getRecommendationBadge(opp.ruleValidation.recommendation)}
                      <Badge variant="outline">Score: {opp.ruleValidation?.score.toFixed(0) || 0}%</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Risk:</span> {opp.riskPercentage.toFixed(1)}%
                    </div>
                    <div>
                      <span className="text-gray-500">Reward:</span> {opp.rewardPercentage.toFixed(1)}%
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence:</span> {opp.confidence.toFixed(0)}%
                    </div>
                    <div>
                      <span className="text-gray-500">Age:</span> {Math.floor((Date.now() - opp.timestamp) / 1000)}s
                    </div>
                  </div>

                  {opp.ruleValidation && opp.ruleValidation.failedRules.length > 0 && (
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <div className="text-sm font-medium text-red-800">Failed Rules:</div>
                      <div className="text-xs text-red-600">{opp.ruleValidation.failedRules.join(", ")}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Executed Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Executed Trades</CardTitle>
          <CardDescription>Recent trades executed through the enhanced trading system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executedTrades.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No trades executed yet. Start trading to see results.</p>
            ) : (
              executedTrades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{trade.pair}</span>
                    <span className="text-sm text-gray-500">
                      {trade.buyExchange} → {trade.sellExchange}
                    </span>
                    <Badge variant="outline">${trade.amount.toFixed(0)}</Badge>
                    {trade.trailingStopActive && <Badge className="bg-purple-100 text-purple-800">Trailing Stop</Badge>}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`font-bold ${trade.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${trade.netProfit.toFixed(2)}
                    </div>
                    <Badge variant="outline">Score: {trade.ruleScore.toFixed(0)}%</Badge>
                    <span className="text-xs text-gray-500">{new Date(trade.executionTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management Status */}
      {status && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Risk Management Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-orange-700">Daily Trades</div>
                <div className="text-lg font-bold text-orange-900">{status.dailyTradeCount}/20</div>
              </div>
              <div>
                <div className="text-sm text-orange-700">Daily P&L</div>
                <div className={`text-lg font-bold ${status.dailyPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${status.dailyPnL.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-orange-700">Risk Exposure</div>
                <div className="text-lg font-bold text-orange-900">{(status.riskExposure * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-orange-700">Active Positions</div>
                <div className="text-lg font-bold text-orange-900">{status.activePositions}/3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
