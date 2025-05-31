import crypto from "crypto"

interface LiveOpportunity {
  id: string
  timestamp: number
  symbol: string
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  grossSpread: number
  netSpread: number
  volume: number
  estimatedProfit: number
  riskLevel: "low" | "medium" | "high"
  confidence: number
  executionTime: number
  status: "detected" | "analyzing" | "executing" | "completed" | "expired"
}

interface LiveTrade {
  id: string
  opportunityId: string
  timestamp: number
  symbol: string
  buyExchange: string
  sellExchange: string
  quantity: number
  buyPrice: number
  sellPrice: number
  actualBuyPrice?: number
  actualSellPrice?: number
  profit: number
  fees: number
  netProfit: number
  executionTime: number
  status: "pending" | "completed" | "failed" | "partial"
  riskAmount: number
  roi: number
}

interface MarketPrice {
  exchange: string
  symbol: string
  bid: number
  ask: number
  timestamp: number
  volume: number
  spread: number
}

interface TradingStatus {
  isRunning: boolean
  isScanning: boolean
  lastScanTime: number
  totalOpportunities: number
  executedTrades: number
  successRate: number
  totalProfit: number
  accountBalance: number
  riskExposure: number
  scanInterval: number
}

class LiveTradingService {
  private isRunning = false
  private isScanning = false
  private opportunities: LiveOpportunity[] = []
  private trades: LiveTrade[] = []
  private marketData: Map<string, MarketPrice> = new Map()
  private scanInterval: NodeJS.Timeout | null = null
  private executionInterval: NodeJS.Timeout | null = null

  private config = {
    scanIntervalMs: 2000, // Scan every 2 seconds
    minSpread: 0.15, // Minimum 0.15% spread
    maxRiskPerTrade: 5, // Max 5% of balance per trade
    maxDailyTrades: 500, // Max 500 trades per day
    stopLossPercentage: 1, // 1% stop loss
    tradingPairs: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "DOTUSDT"],
    exchanges: ["binance", "bybit", "okx"],
    accountBalance: 10000, // $10,000 starting balance
  }

  async startLiveTrading() {
    if (this.isRunning) return

    console.log("🚀 Starting LIVE arbitrage trading system...")

    this.isRunning = true
    this.isScanning = true

    // Start market data simulation
    this.startMarketDataFeed()

    // Start opportunity scanning
    this.startOpportunityScanning()

    // Start trade execution engine
    this.startTradeExecution()

    console.log("✅ LIVE arbitrage system is now active!")
    console.log(`📊 Scanning ${this.config.tradingPairs.length} pairs across ${this.config.exchanges.length} exchanges`)
    console.log(`⚡ Scan interval: ${this.config.scanIntervalMs}ms`)
  }

  stopLiveTrading() {
    console.log("⏹️ Stopping live arbitrage trading...")

    this.isRunning = false
    this.isScanning = false

    if (this.scanInterval) {
      clearInterval(this.scanInterval)
      this.scanInterval = null
    }

    if (this.executionInterval) {
      clearInterval(this.executionInterval)
      this.executionInterval = null
    }

    console.log("✅ Live trading stopped")
  }

  private startMarketDataFeed() {
    // Simulate real-time market data updates
    setInterval(() => {
      this.config.tradingPairs.forEach((symbol) => {
        this.config.exchanges.forEach((exchange) => {
          const basePrice = this.getRealisticPrice(symbol)
          const spread = 0.001 + Math.random() * 0.003 // 0.1% to 0.4% spread

          const marketPrice: MarketPrice = {
            exchange,
            symbol,
            bid: basePrice * (1 - spread / 2),
            ask: basePrice * (1 + spread / 2),
            timestamp: Date.now(),
            volume: 1000 + Math.random() * 9000,
            spread: spread * 100,
          }

          this.marketData.set(`${exchange}-${symbol}`, marketPrice)
        })
      })
    }, 500) // Update every 500ms for real-time feel
  }

  private startOpportunityScanning() {
    this.scanInterval = setInterval(() => {
      if (this.isScanning) {
        this.scanForOpportunities()
      }
    }, this.config.scanIntervalMs)
  }

  private startTradeExecution() {
    this.executionInterval = setInterval(() => {
      if (this.isRunning) {
        this.executeAvailableOpportunities()
      }
    }, 1000) // Check for execution every second
  }

  scanForOpportunities(): LiveOpportunity[] {
    const newOpportunities: LiveOpportunity[] = []

    this.config.tradingPairs.forEach((symbol) => {
      const prices: { exchange: string; bid: number; ask: number; volume: number }[] = []

      // Collect current prices from all exchanges
      this.config.exchanges.forEach((exchange) => {
        const key = `${exchange}-${symbol}`
        const marketPrice = this.marketData.get(key)

        if (marketPrice && Date.now() - marketPrice.timestamp < 5000) {
          prices.push({
            exchange,
            bid: marketPrice.bid,
            ask: marketPrice.ask,
            volume: marketPrice.volume,
          })
        }
      })

      if (prices.length < 2) return

      // Find best arbitrage opportunities
      for (let i = 0; i < prices.length; i++) {
        for (let j = 0; j < prices.length; j++) {
          if (i === j) continue

          const buyExchange = prices[i]
          const sellExchange = prices[j]

          // Calculate spread (buy low, sell high)
          const grossSpread = ((sellExchange.bid - buyExchange.ask) / buyExchange.ask) * 100

          // Account for fees and slippage
          const fees = 0.2 // 0.1% per side
          const slippage = 0.05 + Math.random() * 0.1 // 0.05% to 0.15%
          const netSpread = grossSpread - fees - slippage

          if (netSpread > this.config.minSpread) {
            const volume = Math.min(buyExchange.volume, sellExchange.volume)
            const tradeSize = Math.min(
              volume * 0.1, // Max 10% of available volume
              (this.config.accountBalance * this.config.maxRiskPerTrade) / 100 / buyExchange.ask,
            )

            const estimatedProfit = tradeSize * buyExchange.ask * (netSpread / 100)

            const opportunity: LiveOpportunity = {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              symbol,
              buyExchange: buyExchange.exchange,
              sellExchange: sellExchange.exchange,
              buyPrice: buyExchange.ask,
              sellPrice: sellExchange.bid,
              grossSpread,
              netSpread,
              volume: tradeSize,
              estimatedProfit,
              riskLevel: this.calculateRiskLevel(netSpread, tradeSize),
              confidence: this.calculateConfidence(netSpread, volume),
              executionTime: 0,
              status: "detected",
            }

            newOpportunities.push(opportunity)
          }
        }
      }
    })

    // Add new opportunities and remove expired ones
    this.opportunities = [
      ...newOpportunities,
      ...this.opportunities.filter((op) => Date.now() - op.timestamp < 30000), // Keep for 30 seconds
    ].slice(0, 100) // Keep max 100 opportunities

    console.log(`🔍 Scan complete: Found ${newOpportunities.length} new opportunities`)

    return newOpportunities
  }

  private async executeAvailableOpportunities() {
    const executableOpportunities = this.opportunities.filter(
      (op) => op.status === "detected" && op.netSpread > this.config.minSpread && Date.now() - op.timestamp < 10000, // Execute within 10 seconds
    )

    if (executableOpportunities.length === 0) return

    // Sort by profitability and execute best opportunities
    executableOpportunities
      .sort((a, b) => b.estimatedProfit - a.estimatedProfit)
      .slice(0, 3) // Execute max 3 at a time
      .forEach((opportunity) => {
        this.executeArbitrageTrade(opportunity)
      })
  }

  private async executeArbitrageTrade(opportunity: LiveOpportunity) {
    console.log(`⚡ Executing arbitrage: ${opportunity.symbol}`)
    console.log(`📊 ${opportunity.buyExchange} → ${opportunity.sellExchange}`)
    console.log(`💰 Expected profit: $${opportunity.estimatedProfit.toFixed(4)}`)

    opportunity.status = "executing"
    const startTime = Date.now()

    try {
      // Simulate trade execution with realistic delays and outcomes
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150))

      const success = Math.random() > 0.1 // 90% success rate
      const executionTime = Date.now() - startTime

      if (success) {
        // Calculate actual execution prices with slippage
        const buySlippage = (Math.random() - 0.5) * 0.002 // ±0.2% slippage
        const sellSlippage = (Math.random() - 0.5) * 0.002

        const actualBuyPrice = opportunity.buyPrice * (1 + buySlippage)
        const actualSellPrice = opportunity.sellPrice * (1 + sellSlippage)

        const fees = (opportunity.volume * actualBuyPrice + opportunity.volume * actualSellPrice) * 0.001
        const profit = (actualSellPrice - actualBuyPrice) * opportunity.volume
        const netProfit = profit - fees

        const trade: LiveTrade = {
          id: crypto.randomUUID(),
          opportunityId: opportunity.id,
          timestamp: Date.now(),
          symbol: opportunity.symbol,
          buyExchange: opportunity.buyExchange,
          sellExchange: opportunity.sellExchange,
          quantity: opportunity.volume,
          buyPrice: opportunity.buyPrice,
          sellPrice: opportunity.sellPrice,
          actualBuyPrice,
          actualSellPrice,
          profit,
          fees,
          netProfit,
          executionTime,
          status: "completed",
          riskAmount: opportunity.volume * actualBuyPrice * (this.config.stopLossPercentage / 100),
          roi: (netProfit / (opportunity.volume * actualBuyPrice)) * 100,
        }

        this.trades.unshift(trade)
        opportunity.status = "completed"
        opportunity.executionTime = executionTime

        console.log(`✅ Trade completed: $${netProfit.toFixed(4)} profit in ${executionTime}ms`)
      } else {
        opportunity.status = "expired"
        console.log(`❌ Trade failed: Market conditions changed`)
      }
    } catch (error) {
      opportunity.status = "expired"
      console.error(`❌ Trade execution error:`, error)
    }

    // Keep only recent trades
    if (this.trades.length > 1000) {
      this.trades = this.trades.slice(0, 1000)
    }
  }

  private calculateRiskLevel(spread: number, volume: number): "low" | "medium" | "high" {
    if (spread > 0.5 && volume < 1000) return "low"
    if (spread > 0.3 && volume < 5000) return "medium"
    return "high"
  }

  private calculateConfidence(spread: number, volume: number): number {
    const spreadScore = Math.min(spread / 1.0, 1) * 50 // Max 50 points for spread
    const volumeScore = Math.min(volume / 10000, 1) * 50 // Max 50 points for volume
    return Math.round(spreadScore + volumeScore)
  }

  private getRealisticPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      BTCUSDT: 43000 + (Math.random() - 0.5) * 2000,
      ETHUSDT: 2600 + (Math.random() - 0.5) * 200,
      SOLUSDT: 100 + (Math.random() - 0.5) * 10,
      ADAUSDT: 0.45 + (Math.random() - 0.5) * 0.05,
      DOTUSDT: 7.5 + (Math.random() - 0.5) * 1,
    }
    return basePrices[symbol] || 100
  }

  getStatus(): TradingStatus {
    const completedTrades = this.trades.filter((t) => t.status === "completed")
    const totalProfit = completedTrades.reduce((sum, t) => sum + t.netProfit, 0)
    const successRate = this.trades.length > 0 ? (completedTrades.length / this.trades.length) * 100 : 0

    return {
      isRunning: this.isRunning,
      isScanning: this.isScanning,
      lastScanTime: Date.now(),
      totalOpportunities: this.opportunities.length,
      executedTrades: this.trades.length,
      successRate,
      totalProfit,
      accountBalance: this.config.accountBalance + totalProfit,
      riskExposure: this.calculateCurrentRiskExposure(),
      scanInterval: this.config.scanIntervalMs,
    }
  }

  private calculateCurrentRiskExposure(): number {
    const pendingTrades = this.trades.filter((t) => t.status === "pending")
    return pendingTrades.reduce((sum, t) => sum + t.riskAmount, 0)
  }

  getRecentOpportunities(limit = 20): LiveOpportunity[] {
    return this.opportunities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
  }

  getRecentTrades(limit = 20): LiveTrade[] {
    return this.trades.slice(0, limit)
  }

  getMarketData(): Map<string, MarketPrice> {
    return this.marketData
  }

  // Manual opportunity scan trigger
  triggerManualScan(): LiveOpportunity[] {
    console.log("🔍 Manual opportunity scan triggered")
    return this.scanForOpportunities()
  }

  // Get current best opportunities
  getBestOpportunities(limit = 5): LiveOpportunity[] {
    return this.opportunities
      .filter((op) => op.status === "detected" && op.netSpread > this.config.minSpread)
      .sort((a, b) => b.estimatedProfit - a.estimatedProfit)
      .slice(0, limit)
  }
}

export const liveTradingService = new LiveTradingService()
