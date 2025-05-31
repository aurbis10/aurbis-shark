interface TradingRule {
  category: string
  name: string
  description: string
  check: (opportunity: any, marketData: any) => boolean
  priority: "high" | "medium" | "low"
}

interface RuleValidationResult {
  passed: boolean
  failedRules: string[]
  score: number
  recommendation: "execute" | "reject" | "review"
}

export class TradingRulesEngine {
  private rules: TradingRule[] = []

  constructor() {
    this.initializeRules()
  }

  private initializeRules() {
    // Entry Conditions
    this.rules.push({
      category: "Entry",
      name: "Trend Confirmation",
      description: "Requires clear bullish or bearish trend",
      priority: "high",
      check: (opp, market) => {
        const trend = this.calculateTrend(market.prices)
        return Math.abs(trend) > 0.02 // 2% trend minimum
      },
    })

    this.rules.push({
      category: "Entry",
      name: "Breakout Signal",
      description: "Validates breakout patterns",
      priority: "high",
      check: (opp, market) => {
        return this.detectBreakout(market.prices, market.volume)
      },
    })

    this.rules.push({
      category: "Entry",
      name: "Indicator Confluence",
      description: "Minimum 3 confirming signals",
      priority: "high",
      check: (opp, market) => {
        const signals = this.getConfirmingSignals(market)
        return signals >= 3
      },
    })

    // Risk/Reward Management
    this.rules.push({
      category: "Risk/Reward",
      name: "Minimum Risk Percentage",
      description: "2% minimum risk requirement",
      priority: "high",
      check: (opp) => {
        return opp.riskPercentage >= 2.0
      },
    })

    this.rules.push({
      category: "Risk/Reward",
      name: "Minimum Reward Percentage",
      description: "4% minimum reward requirement",
      priority: "high",
      check: (opp) => {
        return opp.rewardPercentage >= 4.0
      },
    })

    this.rules.push({
      category: "Risk/Reward",
      name: "Risk Reward Ratio",
      description: "Minimum 2:1 reward to risk ratio",
      priority: "high",
      check: (opp) => {
        return opp.rewardPercentage / opp.riskPercentage >= 2.0
      },
    })

    // Volatility Control
    this.rules.push({
      category: "Volatility",
      name: "ATR Volatility Check",
      description: "Uses 14-period ATR for volatility assessment",
      priority: "medium",
      check: (opp, market) => {
        const atr = this.calculateATR(market.prices, 14)
        return atr >= 0.5 && atr <= 5.0 // Avoid ultra low/high volatility
      },
    })

    // Market Session
    this.rules.push({
      category: "Market Session",
      name: "High Liquidity Hours",
      description: "Trade during London/NY sessions only",
      priority: "high",
      check: () => {
        return this.isHighLiquidityHours()
      },
    })

    this.rules.push({
      category: "Market Session",
      name: "Volume Threshold",
      description: "Minimum volume requirement",
      priority: "medium",
      check: (opp, market) => {
        return market.volume >= 1000000 // 1M minimum volume
      },
    })

    // News/Events Protection
    this.rules.push({
      category: "News/Events",
      name: "Event Buffer",
      description: "30-minute buffer around major events",
      priority: "high",
      check: () => {
        return !this.isNearMajorEvent()
      },
    })

    // Position Control
    this.rules.push({
      category: "Position Control",
      name: "One Trade Per Asset",
      description: "Prevents multiple positions in same symbol",
      priority: "high",
      check: (opp) => {
        return !this.hasExistingPosition(opp.pair)
      },
    })

    this.rules.push({
      category: "Position Control",
      name: "Maximum Concurrent Trades",
      description: "Limits simultaneous positions",
      priority: "high",
      check: () => {
        return this.getActivePositions() < 3
      },
    })

    this.rules.push({
      category: "Position Control",
      name: "Asset Exposure Limit",
      description: "Maximum 10% exposure per asset",
      priority: "medium",
      check: (opp) => {
        return this.getAssetExposure(opp.pair) < 0.1
      },
    })

    // Daily Risk Management
    this.rules.push({
      category: "Daily Risk Management",
      name: "Daily Loss Limit",
      description: "Stops trading after 5% daily loss",
      priority: "high",
      check: () => {
        return this.getDailyPnL() > -0.05
      },
    })

    this.rules.push({
      category: "Daily Risk Management",
      name: "Daily Trade Limit",
      description: "Maximum 20 trades per day",
      priority: "medium",
      check: () => {
        return this.getDailyTradeCount() < 20
      },
    })

    this.rules.push({
      category: "Daily Risk Management",
      name: "Cooldown Period",
      description: "60-minute cooldown after losses",
      priority: "medium",
      check: () => {
        return !this.isInCooldownPeriod()
      },
    })

    // Slippage & Fees
    this.rules.push({
      category: "Slippage & Fees",
      name: "Cost Adjustment",
      description: "Adjusts for slippage and fees",
      priority: "high",
      check: (opp) => {
        const totalCosts = 0.05 + 0.2 // 0.05% slippage + 0.2% fees
        return opp.spread - totalCosts >= 0.3 // 0.3% minimum net profit
      },
    })

    // Dynamic Stops
    this.rules.push({
      category: "Dynamic Stops",
      name: "Trailing Stop Configuration",
      description: "Enables trailing stops for profit protection",
      priority: "low",
      check: (opp) => {
        return opp.enableTrailingStop === true
      },
    })
  }

  validateOpportunity(opportunity: any, marketData: any): RuleValidationResult {
    const failedRules: string[] = []
    let score = 0
    const totalRules = this.rules.length

    for (const rule of this.rules) {
      try {
        const passed = rule.check(opportunity, marketData)
        if (passed) {
          score += rule.priority === "high" ? 3 : rule.priority === "medium" ? 2 : 1
        } else {
          failedRules.push(`${rule.category}: ${rule.name}`)
        }
      } catch (error) {
        failedRules.push(`${rule.category}: ${rule.name} (Error)`)
      }
    }

    const maxScore = this.rules.reduce(
      (sum, rule) => sum + (rule.priority === "high" ? 3 : rule.priority === "medium" ? 2 : 1),
      0,
    )

    const normalizedScore = (score / maxScore) * 100

    let recommendation: "execute" | "reject" | "review"
    if (normalizedScore >= 80 && failedRules.length === 0) {
      recommendation = "execute"
    } else if (
      normalizedScore >= 60 &&
      !failedRules.some((rule) => rule.includes("Risk/Reward") || rule.includes("Daily Risk Management"))
    ) {
      recommendation = "review"
    } else {
      recommendation = "reject"
    }

    return {
      passed: failedRules.length === 0,
      failedRules,
      score: normalizedScore,
      recommendation,
    }
  }

  getRulesByCategory(): Record<string, TradingRule[]> {
    const categories: Record<string, TradingRule[]> = {}
    for (const rule of this.rules) {
      if (!categories[rule.category]) {
        categories[rule.category] = []
      }
      categories[rule.category].push(rule)
    }
    return categories
  }

  // Helper methods for rule calculations
  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0
    const start = prices[0]
    const end = prices[prices.length - 1]
    return (end - start) / start
  }

  private detectBreakout(prices: number[], volume: number): boolean {
    // Simplified breakout detection
    if (prices.length < 20) return false
    const recent = prices.slice(-5)
    const previous = prices.slice(-20, -5)
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length
    const previousAvg = previous.reduce((a, b) => a + b) / previous.length
    return Math.abs(recentAvg - previousAvg) / previousAvg > 0.02 && volume > 500000
  }

  private getConfirmingSignals(market: any): number {
    let signals = 0

    // Volume signal
    if (market.volume > 1000000) signals++

    // Price momentum
    if (market.prices && market.prices.length >= 2) {
      const momentum =
        (market.prices[market.prices.length - 1] - market.prices[market.prices.length - 2]) /
        market.prices[market.prices.length - 2]
      if (Math.abs(momentum) > 0.01) signals++
    }

    // Spread signal
    if (market.spread && market.spread > 0.002) signals++

    return signals
  }

  private calculateATR(prices: number[], period: number): number {
    if (prices.length < period) return 1.0

    let atrSum = 0
    for (let i = 1; i < Math.min(period + 1, prices.length); i++) {
      atrSum += Math.abs(prices[i] - prices[i - 1])
    }

    return atrSum / Math.min(period, prices.length - 1) / prices[prices.length - 1]
  }

  private isHighLiquidityHours(): boolean {
    const now = new Date()
    const hour = now.getUTCHours()
    // London: 8-17 UTC, NY: 13-22 UTC, Overlap: 13-17 UTC
    return hour >= 8 && hour <= 22
  }

  private isNearMajorEvent(): boolean {
    // Simplified - in real implementation, check economic calendar
    const now = new Date()
    const minute = now.getMinutes()
    // Simulate major events at :00 and :30
    return minute >= 0 && minute <= 30
  }

  private hasExistingPosition(pair: string): boolean {
    // In real implementation, check active positions
    return false
  }

  private getActivePositions(): number {
    // In real implementation, return actual position count
    return Math.floor(Math.random() * 2) // 0-1 for simulation
  }

  private getAssetExposure(pair: string): number {
    // In real implementation, calculate actual exposure
    return Math.random() * 0.05 // 0-5% for simulation
  }

  private getDailyPnL(): number {
    // In real implementation, calculate actual daily P&L
    return Math.random() * 0.02 - 0.01 // -1% to +1% for simulation
  }

  private getDailyTradeCount(): number {
    // In real implementation, return actual daily trade count
    return Math.floor(Math.random() * 15) // 0-14 for simulation
  }

  private isInCooldownPeriod(): boolean {
    // In real implementation, check last loss time
    return Math.random() < 0.1 // 10% chance of cooldown for simulation
  }
}

export const tradingRulesEngine = new TradingRulesEngine()
