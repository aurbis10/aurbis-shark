import { realMarketDataService, type ArbitrageOpportunity } from "./real-market-data-service"

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

class PaperTradingService {
  private isRunning = false
  private trades: PaperTrade[] = []
  private scanInterval: NodeJS.Timeout | null = null
  private virtualBalance = 100 // Changed from 10000 to 100 USDT
  private settings: TradingSettings = {
    stakePerTrade: 5, // Default 5 USDT per trade
    maxConcurrentTrades: 3,
    maxDailyTrades: 100,
    maxRiskPerTrade: 0.05, // 5%
    minSpreadThreshold: 0.15, // 0.15%
  }

  async start(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.isRunning) {
        return { success: false, message: "Paper trading is already running" }
      }

      // Connect to real market data
      const connected = await realMarketDataService.connect()
      if (!connected) {
        return { success: false, message: "Failed to connect to market data feeds" }
      }

      this.isRunning = true
      this.startScanning()

      return {
        success: true,
        message: `Paper trading started with ${this.virtualBalance} USDT virtual balance`,
      }
    } catch (error) {
      console.error("Error starting paper trading:", error)
      return { success: false, message: "Failed to start paper trading" }
    }
  }

  stop(): { success: boolean; message: string } {
    try {
      this.isRunning = false

      if (this.scanInterval) {
        clearInterval(this.scanInterval)
        this.scanInterval = null
      }

      realMarketDataService.disconnect()

      return { success: true, message: "Paper trading stopped" }
    } catch (error) {
      console.error("Error stopping paper trading:", error)
      return { success: false, message: "Failed to stop paper trading" }
    }
  }

  updateSettings(newSettings: Partial<TradingSettings>): { success: boolean; message: string } {
    try {
      this.settings = { ...this.settings, ...newSettings }

      // Validate settings
      if (this.settings.stakePerTrade > this.virtualBalance * 0.5) {
        this.settings.stakePerTrade = this.virtualBalance * 0.5
        return {
          success: true,
          message: `Settings updated. Stake per trade adjusted to ${this.settings.stakePerTrade} USDT (max 50% of balance)`,
        }
      }

      return { success: true, message: "Trading settings updated successfully" }
    } catch (error) {
      console.error("Error updating settings:", error)
      return { success: false, message: "Failed to update settings" }
    }
  }

  getSettings(): TradingSettings {
    return { ...this.settings }
  }

  private startScanning(): void {
    console.log("🔍 Starting real-time arbitrage scanning...")

    this.scanInterval = setInterval(() => {
      this.scanAndExecute()
    }, 3000) // Scan every 3 seconds
  }

  private async scanAndExecute(): Promise<void> {
    if (!this.isRunning) return

    try {
      // Get current arbitrage opportunities
      const opportunities = realMarketDataService.scanArbitrageOpportunities()

      // Filter profitable opportunities
      const profitableOpportunities = opportunities.filter(
        (opp) =>
          opp.spreadPercent >= this.settings.minSpreadThreshold && opp.riskLevel !== "High" && this.canExecuteTrade(),
      )

      // Execute the best opportunity
      if (profitableOpportunities.length > 0) {
        const bestOpportunity = profitableOpportunities[0]
        await this.executePaperTrade(bestOpportunity)
      }
    } catch (error) {
      console.error("Error in scan and execute:", error)
    }
  }

  private canExecuteTrade(): boolean {
    const pendingTrades = this.trades.filter((t) => t.status === "pending").length
    const todayTrades = this.trades.filter((t) => Date.now() - t.timestamp < 24 * 60 * 60 * 1000).length

    return (
      pendingTrades < this.settings.maxConcurrentTrades &&
      todayTrades < this.settings.maxDailyTrades &&
      this.virtualBalance >= this.settings.stakePerTrade &&
      this.virtualBalance > 1 // Minimum balance check
    )
  }

  private async executePaperTrade(opportunity: ArbitrageOpportunity): Promise<void> {
    // Use the configured stake per trade
    const tradeAmount = Math.min(
      this.settings.stakePerTrade,
      this.virtualBalance * this.settings.maxRiskPerTrade,
      opportunity.volume * 0.1, // Max 10% of available volume
    )

    const trade: PaperTrade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: opportunity.symbol,
      buyExchange: opportunity.buyExchange,
      sellExchange: opportunity.sellExchange,
      buyPrice: opportunity.buyPrice,
      sellPrice: opportunity.sellPrice,
      amount: tradeAmount,
      expectedProfit: (opportunity.sellPrice - opportunity.buyPrice) * (tradeAmount / opportunity.buyPrice),
      actualProfit: 0,
      status: "pending",
      timestamp: Date.now(),
      slippage: 0,
      fees: 0,
    }

    this.trades.push(trade)
    console.log(
      `📈 Executing paper trade: ${trade.symbol} ${trade.buyExchange}→${trade.sellExchange} (${tradeAmount} USDT)`,
    )

    // Simulate execution delay (100-500ms)
    setTimeout(
      () => {
        this.completePaperTrade(trade)
      },
      Math.random() * 400 + 100,
    )
  }

  private completePaperTrade(trade: PaperTrade): void {
    // Simulate realistic execution
    const executionSuccess = Math.random() > 0.1 // 90% success rate

    if (executionSuccess) {
      // Calculate realistic slippage (0.01% to 0.05%)
      trade.slippage = (Math.random() * 0.04 + 0.01) / 100

      // Calculate fees (0.1% per side = 0.2% total)
      trade.fees = trade.amount * 0.002

      // Calculate actual profit with slippage and fees
      const slippageImpact = trade.amount * trade.slippage
      trade.actualProfit = trade.expectedProfit - slippageImpact - trade.fees

      trade.status = "executed"
      this.virtualBalance += trade.actualProfit

      console.log(`✅ Trade executed: ${trade.symbol} profit: $${trade.actualProfit.toFixed(2)}`)
    } else {
      trade.status = "failed"
      trade.actualProfit = -trade.fees // Only lose fees on failed trades
      this.virtualBalance -= trade.fees

      console.log(`❌ Trade failed: ${trade.symbol}`)
    }

    trade.executionTime = Date.now()
  }

  resetBalance(): { success: boolean; message: string } {
    try {
      this.virtualBalance = 100
      this.trades = []
      return { success: true, message: "Virtual balance reset to 100 USDT" }
    } catch (error) {
      console.error("Error resetting balance:", error)
      return { success: false, message: "Failed to reset balance" }
    }
  }

  getStatus(): {
    isRunning: boolean
    isConnected: boolean
    currentOpportunities: ArbitrageOpportunity[]
    recentTrades: PaperTrade[]
    stats: PaperTradingStats
    virtualBalance: number
    settings: TradingSettings
  } {
    const currentOpportunities = this.isRunning ? realMarketDataService.scanArbitrageOpportunities().slice(0, 10) : []

    const recentTrades = this.trades
      .filter((t) => Date.now() - t.timestamp < 60 * 60 * 1000) // Last hour
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20)

    return {
      isRunning: this.isRunning,
      isConnected: realMarketDataService.isConnectedToMarket(),
      currentOpportunities,
      recentTrades,
      stats: this.calculateStats(),
      virtualBalance: this.virtualBalance,
      settings: this.getSettings(),
    }
  }

  private calculateStats(): PaperTradingStats {
    const completedTrades = this.trades.filter((t) => t.status !== "pending")
    const successfulTrades = this.trades.filter((t) => t.status === "executed")
    const failedTrades = this.trades.filter((t) => t.status === "failed")

    const totalProfit = successfulTrades.reduce((sum, t) => sum + t.actualProfit, 0)
    const totalFees = this.trades.reduce((sum, t) => sum + t.fees, 0)

    return {
      totalTrades: completedTrades.length,
      successfulTrades: successfulTrades.length,
      failedTrades: failedTrades.length,
      totalProfit,
      totalFees,
      successRate: completedTrades.length > 0 ? (successfulTrades.length / completedTrades.length) * 100 : 0,
      averageProfit: successfulTrades.length > 0 ? totalProfit / successfulTrades.length : 0,
      riskExposure:
        (this.trades.filter((t) => t.status === "pending").length / this.settings.maxConcurrentTrades) * 100,
    }
  }

  manualScan(): ArbitrageOpportunity[] {
    return realMarketDataService.scanArbitrageOpportunities()
  }
}

export const paperTradingService = new PaperTradingService()
export type { PaperTrade, PaperTradingStats, TradingSettings }
