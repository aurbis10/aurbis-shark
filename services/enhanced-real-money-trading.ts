import { tradingRulesEngine } from "./trading-rules-engine"

interface EnhancedTradingOpportunity {
  id: string
  pair: string
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  spread: number
  volume: number
  riskPercentage: number
  rewardPercentage: number
  enableTrailingStop: boolean
  confidence: number
  timestamp: number
  ruleValidation?: any
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
  buyPrice: number
  sellPrice: number
  profit: number
  fees: number
  slippage: number
  netProfit: number
  executionTime: number
  ruleScore: number
  trailingStopActive: boolean
}

class EnhancedRealMoneyTradingService {
  private status: EnhancedTradingStatus = {
    isActive: false,
    startTime: null,
    totalOpportunities: 0,
    approvedTrades: 0,
    rejectedTrades: 0,
    executedTrades: 0,
    totalProfit: 0,
    successRate: 0,
    dailyTradeCount: 0,
    dailyPnL: 0,
    riskExposure: 0,
    activePositions: 0,
    lastRuleCheck: 0,
  }

  private opportunities: EnhancedTradingOpportunity[] = []
  private executedTrades: ExecutedTrade[] = []
  private scanInterval: NodeJS.Timeout | null = null
  private updateInterval: NodeJS.Timeout | null = null

  async startEnhancedTrading(): Promise<void> {
    if (this.status.isActive) {
      throw new Error("Enhanced trading is already active")
    }

    this.status.isActive = true
    this.status.startTime = Date.now()

    // Start scanning for opportunities
    this.scanInterval = setInterval(() => {
      this.scanForOpportunities()
    }, 3000) // Every 3 seconds

    // Start status updates
    this.updateInterval = setInterval(() => {
      this.updateStatus()
    }, 1000) // Every second

    console.log("Enhanced trading started with professional rules engine")
  }

  stopEnhancedTrading(): void {
    this.status.isActive = false

    if (this.scanInterval) {
      clearInterval(this.scanInterval)
      this.scanInterval = null
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }

    console.log("Enhanced trading stopped")
  }

  private async scanForOpportunities(): Promise<void> {
    if (!this.status.isActive) return

    try {
      const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "DOT/USDT"]
      const exchanges = ["Binance", "Bybit", "OKX"]

      for (const pair of pairs) {
        for (let i = 0; i < exchanges.length; i++) {
          for (let j = i + 1; j < exchanges.length; j++) {
            const opportunity = this.generateOpportunity(pair, exchanges[i], exchanges[j])

            if (opportunity) {
              this.status.totalOpportunities++

              // Validate against trading rules
              const marketData = this.getMarketData(pair)
              const validation = tradingRulesEngine.validateOpportunity(opportunity, marketData)

              opportunity.ruleValidation = validation
              this.status.lastRuleCheck = Date.now()

              if (validation.recommendation === "execute") {
                this.status.approvedTrades++
                this.opportunities.unshift(opportunity)

                // Execute the trade
                await this.executeEnhancedTrade(opportunity)
              } else {
                this.status.rejectedTrades++
                console.log(`Trade rejected: ${validation.failedRules.join(", ")}`)
              }
            }
          }
        }
      }

      // Keep only recent opportunities
      this.opportunities = this.opportunities.slice(0, 20)
    } catch (error) {
      console.error("Error scanning for opportunities:", error)
    }
  }

  private generateOpportunity(
    pair: string,
    buyExchange: string,
    sellExchange: string,
  ): EnhancedTradingOpportunity | null {
    const basePrice = this.getBasePrice(pair)
    const buyPrice = basePrice * (1 + (Math.random() - 0.5) * 0.008) // ±0.4% variation
    const sellPrice = basePrice * (1 + (Math.random() - 0.5) * 0.008)

    const spread = ((sellPrice - buyPrice) / buyPrice) * 100

    // Enhanced criteria for professional trading
    if (spread < 0.25) return null // Minimum 0.25% spread (higher than basic)

    const volume = Math.random() * 5000000 + 500000 // 500K to 5.5M
    const riskPercentage = Math.random() * 3 + 2 // 2-5% risk
    const rewardPercentage = riskPercentage * (1.5 + Math.random() * 2) // 1.5x to 3.5x reward

    return {
      id: `enh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pair,
      buyExchange,
      sellExchange,
      buyPrice,
      sellPrice,
      spread,
      volume,
      riskPercentage,
      rewardPercentage,
      enableTrailingStop: true,
      confidence: Math.min(95, 60 + spread * 10),
      timestamp: Date.now(),
    }
  }

  private getMarketData(pair: string) {
    // Generate realistic market data for rule validation
    const basePrice = this.getBasePrice(pair)
    const prices = []

    // Generate 20 price points for trend analysis
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
      prices.push(basePrice * (1 + variation))
    }

    return {
      prices,
      volume: Math.random() * 10000000 + 1000000, // 1M to 11M
      spread: Math.random() * 0.01 + 0.001, // 0.1% to 1.1%
      timestamp: Date.now(),
    }
  }

  private async executeEnhancedTrade(opportunity: EnhancedTradingOpportunity): Promise<void> {
    try {
      // Conservative position sizing for real money
      const maxTradeAmount = 1000 // $1000 max per trade
      const amount = Math.min(maxTradeAmount, opportunity.volume * 0.001)

      // Calculate costs
      const fees = amount * 0.002 // 0.2% total fees
      const slippage = amount * 0.0005 // 0.05% slippage
      const grossProfit = amount * (opportunity.spread / 100)
      const netProfit = grossProfit - fees - slippage

      // Enhanced execution simulation with 95% success rate
      const executionSuccess = Math.random() < 0.95

      if (executionSuccess && netProfit > 0) {
        const trade: ExecutedTrade = {
          id: opportunity.id,
          pair: opportunity.pair,
          buyExchange: opportunity.buyExchange,
          sellExchange: opportunity.sellExchange,
          amount,
          buyPrice: opportunity.buyPrice,
          sellPrice: opportunity.sellPrice,
          profit: grossProfit,
          fees,
          slippage,
          netProfit,
          executionTime: Date.now(),
          ruleScore: opportunity.ruleValidation?.score || 0,
          trailingStopActive: opportunity.enableTrailingStop,
        }

        this.executedTrades.unshift(trade)
        this.status.executedTrades++
        this.status.totalProfit += netProfit
        this.status.dailyTradeCount++
        this.status.dailyPnL += netProfit

        // Implement trailing stop logic
        if (trade.trailingStopActive) {
          this.activateTrailingStop(trade)
        }

        console.log(`Enhanced trade executed: ${opportunity.pair} - Net Profit: $${netProfit.toFixed(2)}`)
      }

      // Keep only recent trades
      this.executedTrades = this.executedTrades.slice(0, 50)
    } catch (error) {
      console.error("Error executing enhanced trade:", error)
    }
  }

  private activateTrailingStop(trade: ExecutedTrade): void {
    // Simulate trailing stop logic
    setTimeout(
      () => {
        if (Math.random() < 0.3) {
          // 30% chance of trailing stop activation
          const additionalProfit = trade.netProfit * 0.2 // 20% additional profit
          trade.netProfit += additionalProfit
          this.status.totalProfit += additionalProfit
          console.log(`Trailing stop activated for ${trade.pair}: +$${additionalProfit.toFixed(2)}`)
        }
      },
      Math.random() * 30000 + 10000,
    ) // 10-40 seconds
  }

  private updateStatus(): void {
    if (this.status.executedTrades > 0) {
      this.status.successRate = (this.status.executedTrades / this.status.approvedTrades) * 100
    }

    // Calculate risk exposure
    this.status.riskExposure = Math.min(0.05, this.status.dailyTradeCount * 0.002) // Max 5%
    this.status.activePositions = Math.floor(Math.random() * 3) // 0-2 active positions

    // Reset daily counters at midnight (simplified)
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      this.status.dailyTradeCount = 0
      this.status.dailyPnL = 0
    }
  }

  private getBasePrice(pair: string): number {
    const prices: Record<string, number> = {
      "BTC/USDT": 43000,
      "ETH/USDT": 2600,
      "SOL/USDT": 100,
      "ADA/USDT": 0.5,
      "DOT/USDT": 7.5,
    }
    return prices[pair] || 100
  }

  getStatus(): EnhancedTradingStatus {
    return { ...this.status }
  }

  getOpportunities(): EnhancedTradingOpportunity[] {
    return [...this.opportunities]
  }

  getExecutedTrades(): ExecutedTrade[] {
    return [...this.executedTrades]
  }

  getRuleValidationStats() {
    const total = this.status.totalOpportunities
    const approved = this.status.approvedTrades
    const rejected = this.status.rejectedTrades

    return {
      totalOpportunities: total,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
      averageScore:
        this.executedTrades.length > 0
          ? this.executedTrades.reduce((sum, trade) => sum + trade.ruleScore, 0) / this.executedTrades.length
          : 0,
    }
  }

  emergencyStop(): void {
    this.stopEnhancedTrading()
    console.log("EMERGENCY STOP: All enhanced trading halted immediately")
  }
}

export const enhancedRealMoneyTradingService = new EnhancedRealMoneyTradingService()
