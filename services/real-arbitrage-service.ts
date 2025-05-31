import { webSocketMarketService } from "./websocket-market-service"
import { realExchangeService } from "./real-exchange-service"

interface RealTrade {
  id: string
  timestamp: number
  symbol: string
  buyExchange: string
  sellExchange: string
  quantity: number
  buyPrice: number
  sellPrice: number
  spread: number
  status: "pending" | "completed" | "failed" | "partial"
  buyOrderId?: string
  sellOrderId?: string
  profit: number
  fees: number
  netProfit: number
  actualBuyPrice?: number
  actualSellPrice?: number
}

interface AccountSummary {
  totalBalance: number
  availableBalance: number
  balances: any[]
  lastUpdated: number
}

// Simple UUID generator for Edge Runtime
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

class RealArbitrageService {
  private isRunning = false
  private trades: RealTrade[] = []
  private minSpread = 0.15 // 0.15% minimum spread
  private maxTradeSize = 50 // Max $50 per trade for safety
  private tradingPairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
  private accountSummary: AccountSummary | null = null
  private balanceUpdateInterval: NodeJS.Timeout | null = null

  async start() {
    if (this.isRunning) return

    console.log("🚀 Starting REAL arbitrage trading with live market data...")

    try {
      // First, fetch real account balances
      await this.updateAccountBalances()

      // Connect to market data service
      await webSocketMarketService.connect()

      // Set up arbitrage opportunity listener
      webSocketMarketService.onArbitrageOpportunity(async (opportunity) => {
        await this.evaluateAndExecuteArbitrage(opportunity)
      })

      // Start periodic balance updates
      this.startBalanceUpdates()

      this.isRunning = true
      console.log("✅ REAL arbitrage system is now LIVE and monitoring markets!")
      console.log(`💰 Account Balance: $${this.accountSummary?.totalBalance.toFixed(2) || "0.00"}`)
    } catch (error) {
      console.error("❌ Failed to start real arbitrage system:", error)
      throw error
    }
  }

  stop() {
    if (!this.isRunning) return

    console.log("⏹️ Stopping real arbitrage trading...")
    webSocketMarketService.disconnect()

    if (this.balanceUpdateInterval) {
      clearInterval(this.balanceUpdateInterval)
      this.balanceUpdateInterval = null
    }

    this.isRunning = false
    console.log("✅ Real arbitrage system stopped")
  }

  private async updateAccountBalances() {
    try {
      console.log("📊 Fetching real account balances from exchanges...")
      this.accountSummary = await realExchangeService.getAccountSummary()
      console.log(`💰 Total Balance: $${this.accountSummary.totalBalance.toFixed(2)}`)
      console.log(`💵 Available: $${this.accountSummary.availableBalance.toFixed(2)}`)
    } catch (error) {
      console.error("❌ Failed to update account balances:", error)
    }
  }

  private startBalanceUpdates() {
    // Update balances every 30 seconds
    this.balanceUpdateInterval = setInterval(async () => {
      await this.updateAccountBalances()
    }, 30000)
  }

  private async evaluateAndExecuteArbitrage(opportunity: any) {
    try {
      // Check if we have sufficient balance
      if (!this.accountSummary || this.accountSummary.availableBalance < 10) {
        console.log("⚠️ Insufficient balance for arbitrage trading")
        return
      }

      // Check if spread is profitable after fees
      const estimatedFees = 0.2 // 0.1% per side
      const netSpread = opportunity.spread - estimatedFees

      if (netSpread < this.minSpread) {
        console.log(`⚠️ Spread too small: ${netSpread.toFixed(3)}% < ${this.minSpread}%`)
        return
      }

      // Calculate trade size based on available balance
      const maxTradeValue = Math.min(
        this.maxTradeSize,
        this.accountSummary.availableBalance * 0.1, // Use max 10% of available balance
        opportunity.volume * 0.05, // Use max 5% of available volume
      )

      const quantity = maxTradeValue / opportunity.buyPrice

      // Check minimum trade size requirements
      if (maxTradeValue < 10) {
        console.log(`⚠️ Trade size too small: $${maxTradeValue.toFixed(2)} < $10`)
        return
      }

      console.log(`🎯 Executing REAL arbitrage: ${opportunity.symbol}`)
      console.log(`📊 Spread: ${opportunity.spread.toFixed(3)}% | Size: $${maxTradeValue.toFixed(2)}`)
      console.log(`💰 Available Balance: $${this.accountSummary.availableBalance.toFixed(2)}`)

      const trade: RealTrade = {
        id: generateUUID(),
        timestamp: Date.now(),
        symbol: opportunity.symbol,
        buyExchange: opportunity.buyExchange,
        sellExchange: opportunity.sellExchange,
        quantity: quantity,
        buyPrice: opportunity.buyPrice,
        sellPrice: opportunity.sellPrice,
        spread: opportunity.spread,
        status: "pending",
        profit: 0,
        fees: 0,
        netProfit: 0,
      }

      // Execute the arbitrage trade on real exchanges
      const result = await realExchangeService.executeArbitrageTrade(
        opportunity.buyExchange,
        opportunity.sellExchange,
        opportunity.symbol,
        quantity,
        opportunity.buyPrice,
        opportunity.sellPrice,
      )

      // Update trade status based on results
      if (result.buyResult.success && result.sellResult.success) {
        trade.status = "completed"
        trade.buyOrderId = result.buyResult.orderId
        trade.sellOrderId = result.sellResult.orderId
        trade.actualBuyPrice = result.buyResult.executedPrice
        trade.actualSellPrice = result.sellResult.executedPrice

        // Calculate actual profit with real execution prices
        const buyValue =
          (result.buyResult.executedQuantity || quantity) * (result.buyResult.executedPrice || opportunity.buyPrice)
        const sellValue =
          (result.sellResult.executedQuantity || quantity) * (result.sellResult.executedPrice || opportunity.sellPrice)
        const fees = (result.buyResult.fees || 0) + (result.sellResult.fees || 0) + (buyValue + sellValue) * 0.001

        trade.profit = sellValue - buyValue
        trade.fees = fees
        trade.netProfit = trade.profit - fees

        console.log(`✅ REAL arbitrage completed: Net profit $${trade.netProfit.toFixed(4)}`)
        console.log(`📋 Buy Order: ${trade.buyOrderId} | Sell Order: ${trade.sellOrderId}`)

        // Update account balances after successful trade
        setTimeout(() => this.updateAccountBalances(), 2000)
      } else if (result.buyResult.success && !result.sellResult.success) {
        trade.status = "partial"
        trade.buyOrderId = result.buyResult.orderId
        trade.actualBuyPrice = result.buyResult.executedPrice

        console.log(`⚠️ Partial execution: Buy succeeded (${trade.buyOrderId}), sell failed`)
        console.log(`🔄 Consider manual intervention for order: ${trade.buyOrderId}`)

        // Update balances as buy order was executed
        setTimeout(() => this.updateAccountBalances(), 2000)
      } else {
        trade.status = "failed"
        console.log(`❌ Arbitrage failed: ${result.buyResult.error || result.sellResult.error}`)
      }

      // Store the trade
      this.trades.unshift(trade)
      if (this.trades.length > 1000) {
        this.trades = this.trades.slice(0, 1000)
      }
    } catch (error) {
      console.error("❌ Error executing arbitrage:", error)
    }
  }

  getStatus() {
    const completedTrades = this.trades.filter((t) => t.status === "completed")
    const totalProfit = completedTrades.reduce((sum, t) => sum + t.netProfit, 0)
    const totalFees = this.trades.reduce((sum, t) => sum + t.fees, 0)

    return {
      isRunning: this.isRunning,
      isConnected: webSocketMarketService.isConnectedToExchanges(),
      totalTrades: this.trades.length,
      completedTrades: completedTrades.length,
      totalProfit: totalProfit,
      totalFees: totalFees,
      winRate: this.trades.length > 0 ? (completedTrades.length / this.trades.length) * 100 : 0,
      recentOpportunities: webSocketMarketService.getRecentOpportunities(10),
      accountSummary: this.accountSummary,
      realBalance: this.accountSummary?.totalBalance || 0,
      availableBalance: this.accountSummary?.availableBalance || 0,
    }
  }

  getRecentTrades(limit = 20) {
    return this.trades.slice(0, limit)
  }

  getMarketData() {
    return webSocketMarketService.getMarketData()
  }

  async getDetailedBalances() {
    return await realExchangeService.getAllBalances()
  }

  async forceBalanceUpdate() {
    await this.updateAccountBalances()
    return this.accountSummary
  }
}

export const realArbitrageService = new RealArbitrageService()
