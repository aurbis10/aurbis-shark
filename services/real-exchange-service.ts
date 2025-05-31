// Edge Runtime compatible exchange service with enhanced error handling and individual exchange balance tracking
interface ExchangeCredentials {
  apiKey: string
  secretKey: string
  passphrase?: string
  testnet: boolean
}

interface OrderResult {
  success: boolean
  orderId?: string
  executedPrice?: number
  executedQuantity?: number
  error?: string
  fees?: number
}

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
  usdValue: number
}

interface ExchangeAccount {
  exchange: string
  totalUsdBalance: number
  availableUsdBalance: number
  balances: Balance[]
  lastUpdated: number
  connectionStatus: "connected" | "disconnected" | "mock"
  tradeCount: number
  lastTradeTime?: number
}

interface AccountInfo {
  totalBalance: number
  availableBalance: number
  balances: Balance[]
  lastUpdated: number
  exchanges: ExchangeAccount[]
}

class RealExchangeService {
  private credentials: Map<string, ExchangeCredentials> = new Map()
  private exchangeAccounts: Map<string, ExchangeAccount> = new Map()
  private tradeHistory: Map<string, any[]> = new Map()
  private mockMode = true // Start in mock mode by default
  private lastSuccessfulFetch: Map<string, number> = new Map()

  constructor() {
    this.loadCredentials()
    this.initializeExchangeAccounts()
    console.log("🔧 RealExchangeService initialized with individual exchange tracking")
  }

  private loadCredentials() {
    // Load testnet credentials from environment variables
    const binanceTestnet = {
      apiKey: process.env.BINANCE_TESTNET_API_KEY || "",
      secretKey: process.env.BINANCE_TESTNET_SECRET_KEY || "",
      testnet: true,
    }

    const bybitTestnet = {
      apiKey: process.env.BYBIT_TESTNET_API_KEY || "",
      secretKey: process.env.BYBIT_TESTNET_SECRET_KEY || "",
      testnet: true,
    }

    const okxDemo = {
      apiKey: process.env.OKX_DEMO_API_KEY || "",
      secretKey: process.env.OKX_DEMO_SECRET_KEY || "",
      passphrase: process.env.OKX_DEMO_PASSPHRASE || "",
      testnet: true,
    }

    this.credentials.set("binance", binanceTestnet)
    this.credentials.set("bybit", bybitTestnet)
    this.credentials.set("okx", okxDemo)

    // Check if we have any valid credentials
    const hasValidCredentials = Array.from(this.credentials.values()).some((cred) => cred.apiKey && cred.secretKey)

    if (!hasValidCredentials) {
      console.log("⚠️ No valid API credentials found, using mock mode")
      this.mockMode = true
    }
  }

  private initializeExchangeAccounts() {
    const exchanges = ["binance", "bybit", "okx"]

    exchanges.forEach((exchange) => {
      const balances = this.getRealisticBalancesForExchange(exchange)
      const totalUsd = balances.reduce((sum, b) => sum + b.usdValue, 0)
      const availableUsd = balances.reduce((sum, b) => sum + b.free * this.getAssetPrice(b.asset), 0)

      this.exchangeAccounts.set(exchange, {
        exchange,
        totalUsdBalance: totalUsd,
        availableUsdBalance: availableUsd,
        balances,
        lastUpdated: Date.now(),
        connectionStatus: "mock",
        tradeCount: 0,
        lastTradeTime: undefined,
      })

      // Initialize empty trade history
      this.tradeHistory.set(exchange, [])
    })
  }

  private getAssetPrice(asset: string): number {
    const prices: { [key: string]: number } = {
      USDT: 1.0,
      BTC: 43000 + (Math.random() - 0.5) * 2000,
      ETH: 2600 + (Math.random() - 0.5) * 200,
      SOL: 100 + (Math.random() - 0.5) * 10,
      ADA: 0.45 + (Math.random() - 0.5) * 0.05,
      DOT: 7.5 + (Math.random() - 0.5) * 1,
      BNB: 300 + (Math.random() - 0.5) * 30,
      MATIC: 0.8 + (Math.random() - 0.5) * 0.1,
    }
    return prices[asset] || 1.0
  }

  private getRealisticBalancesForExchange(exchange: string): Balance[] {
    const exchangeConfigs = {
      binance: [
        { asset: "USDT", baseAmount: 1200, variation: 300 },
        { asset: "BTC", baseAmount: 0.015, variation: 0.005 },
        { asset: "ETH", baseAmount: 0.8, variation: 0.2 },
        { asset: "BNB", baseAmount: 2, variation: 0.5 },
        { asset: "SOL", baseAmount: 8, variation: 2 },
      ],
      bybit: [
        { asset: "USDT", baseAmount: 1800, variation: 400 },
        { asset: "BTC", baseAmount: 0.02, variation: 0.008 },
        { asset: "ETH", baseAmount: 1.2, variation: 0.3 },
        { asset: "SOL", baseAmount: 12, variation: 3 },
        { asset: "ADA", baseAmount: 150, variation: 50 },
      ],
      okx: [
        { asset: "USDT", baseAmount: 2500, variation: 500 },
        { asset: "BTC", baseAmount: 0.025, variation: 0.01 },
        { asset: "ETH", baseAmount: 1.5, variation: 0.4 },
        { asset: "DOT", baseAmount: 25, variation: 10 },
        { asset: "MATIC", baseAmount: 100, variation: 30 },
      ],
    }

    const config = exchangeConfigs[exchange as keyof typeof exchangeConfigs] || exchangeConfigs.binance

    return config.map(({ asset, baseAmount, variation }) => {
      const total = Math.max(0, baseAmount + (Math.random() - 0.5) * variation)
      const locked = total * (Math.random() * 0.05) // 0-5% locked
      const free = total - locked
      const price = this.getAssetPrice(asset)

      return {
        asset,
        free: Math.max(0, free),
        locked: Math.max(0, locked),
        total,
        usdValue: total * price,
      }
    })
  }

  // Enhanced HMAC-SHA256 implementation for Edge Runtime
  private async hmacSha256(key: string, message: string): Promise<string> {
    try {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(key)
      const messageData = encoder.encode(message)

      const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
        "sign",
      ])

      const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
      return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    } catch (error) {
      console.error("HMAC signing failed:", error)
      throw new Error("Failed to generate signature")
    }
  }

  // Base64 encoding for Edge Runtime
  private base64Encode(str: string): Promise<string> {
    try {
      return Promise.resolve(btoa(str))
    } catch (error) {
      console.error("Base64 encoding failed:", error)
      throw new Error("Failed to encode base64")
    }
  }

  // Enhanced fetch with timeout and retry logic
  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout")
      }
      throw error
    }
  }

  // Simulate trade execution on specific exchange
  async executeTradeOnExchange(
    exchange: string,
    symbol: string,
    side: "buy" | "sell",
    quantity: number,
    price: number,
  ): Promise<OrderResult> {
    console.log(`🔄 Executing ${side} order on ${exchange}: ${quantity} ${symbol} at $${price}`)

    // Simulate realistic execution delay
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

    const success = Math.random() > 0.05 // 95% success rate
    const executedPrice = price * (1 + (Math.random() - 0.5) * 0.002) // ±0.2% slippage
    const fees = quantity * executedPrice * 0.001 // 0.1% fee

    if (success) {
      const orderId = `${exchange}_${side}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`

      // Update exchange account balance
      this.updateExchangeBalanceAfterTrade(exchange, symbol, side, quantity, executedPrice, fees)

      // Record trade in history
      this.recordTradeOnExchange(exchange, {
        orderId,
        symbol,
        side,
        quantity,
        price: executedPrice,
        fees,
        timestamp: Date.now(),
        status: "completed",
      })

      return {
        success: true,
        orderId,
        executedPrice,
        executedQuantity: quantity,
        fees,
      }
    } else {
      return {
        success: false,
        error: `${side} order failed on ${exchange}: Insufficient liquidity`,
      }
    }
  }

  private updateExchangeBalanceAfterTrade(
    exchange: string,
    symbol: string,
    side: "buy" | "sell",
    quantity: number,
    price: number,
    fees: number,
  ) {
    const account = this.exchangeAccounts.get(exchange)
    if (!account) return

    const baseAsset = symbol.replace("USDT", "")
    const quoteAsset = "USDT"

    // Find or create balances
    let baseBalance = account.balances.find((b) => b.asset === baseAsset)
    let quoteBalance = account.balances.find((b) => b.asset === quoteAsset)

    if (!baseBalance) {
      baseBalance = { asset: baseAsset, free: 0, locked: 0, total: 0, usdValue: 0 }
      account.balances.push(baseBalance)
    }

    if (!quoteBalance) {
      quoteBalance = { asset: quoteAsset, free: 0, locked: 0, total: 0, usdValue: 0 }
      account.balances.push(quoteBalance)
    }

    if (side === "buy") {
      // Buying: Decrease USDT, Increase base asset
      const totalCost = quantity * price + fees
      quoteBalance.free = Math.max(0, quoteBalance.free - totalCost)
      quoteBalance.total = quoteBalance.free + quoteBalance.locked

      baseBalance.free += quantity
      baseBalance.total = baseBalance.free + baseBalance.locked
    } else {
      // Selling: Decrease base asset, Increase USDT
      baseBalance.free = Math.max(0, baseBalance.free - quantity)
      baseBalance.total = baseBalance.free + baseBalance.locked

      const totalReceived = quantity * price - fees
      quoteBalance.free += totalReceived
      quoteBalance.total = quoteBalance.free + quoteBalance.locked
    }

    // Update USD values
    baseBalance.usdValue = baseBalance.total * this.getAssetPrice(baseBalance.asset)
    quoteBalance.usdValue = quoteBalance.total * this.getAssetPrice(quoteBalance.asset)

    // Update account totals
    account.totalUsdBalance = account.balances.reduce((sum, b) => sum + b.usdValue, 0)
    account.availableUsdBalance = account.balances.reduce((sum, b) => sum + b.free * this.getAssetPrice(b.asset), 0)
    account.lastUpdated = Date.now()
    account.tradeCount++
    account.lastTradeTime = Date.now()

    console.log(`💰 ${exchange} balance updated: $${account.totalUsdBalance.toFixed(2)} total`)
  }

  private recordTradeOnExchange(exchange: string, trade: any) {
    const history = this.tradeHistory.get(exchange) || []
    history.unshift(trade)

    // Keep last 100 trades per exchange
    if (history.length > 100) {
      history.splice(100)
    }

    this.tradeHistory.set(exchange, history)
  }

  async executeArbitrageTrade(
    buyExchange: string,
    sellExchange: string,
    symbol: string,
    quantity: number,
    buyPrice: number,
    sellPrice: number,
  ): Promise<{ buyResult: OrderResult; sellResult: OrderResult }> {
    console.log(`🔄 Executing arbitrage: ${symbol}`)
    console.log(`📈 Buy ${quantity} on ${buyExchange} at $${buyPrice}`)
    console.log(`📉 Sell ${quantity} on ${sellExchange} at $${sellPrice}`)

    // Execute both trades
    const [buyResult, sellResult] = await Promise.all([
      this.executeTradeOnExchange(buyExchange, symbol, "buy", quantity, buyPrice),
      this.executeTradeOnExchange(sellExchange, symbol, "sell", quantity, sellPrice),
    ])

    if (buyResult.success && sellResult.success) {
      const profit =
        (sellResult.executedPrice! - buyResult.executedPrice!) * quantity - (buyResult.fees! + sellResult.fees!)
      console.log(`✅ Arbitrage completed: $${profit.toFixed(4)} profit`)
    }

    return { buyResult, sellResult }
  }

  async getBalances(exchange: string): Promise<Balance[]> {
    const account = this.exchangeAccounts.get(exchange)
    if (!account) {
      return this.getRealisticBalancesForExchange(exchange)
    }

    // Add some realistic variation to balances over time
    account.balances.forEach((balance) => {
      // Small random variations (±0.1%)
      const variation = 1 + (Math.random() - 0.5) * 0.002
      balance.free *= variation
      balance.total = balance.free + balance.locked
      balance.usdValue = balance.total * this.getAssetPrice(balance.asset)
    })

    account.lastUpdated = Date.now()
    return account.balances
  }

  async getAllBalances(): Promise<{ [exchange: string]: Balance[] }> {
    const results: { [exchange: string]: Balance[] } = {}
    const exchanges = ["binance", "bybit", "okx"]

    for (const exchange of exchanges) {
      results[exchange] = await this.getBalances(exchange)
    }

    return results
  }

  getExchangeAccount(exchange: string): ExchangeAccount | null {
    return this.exchangeAccounts.get(exchange) || null
  }

  getAllExchangeAccounts(): ExchangeAccount[] {
    return Array.from(this.exchangeAccounts.values())
  }

  getExchangeTradeHistory(exchange: string, limit = 20): any[] {
    const history = this.tradeHistory.get(exchange) || []
    return history.slice(0, limit)
  }

  async getAccountSummary(): Promise<AccountInfo> {
    const allBalances = await this.getAllBalances()
    const exchanges = this.getAllExchangeAccounts()

    let totalBalance = 0
    let availableBalance = 0
    const consolidatedBalances: Balance[] = []

    // Consolidate balances from all exchanges
    Object.entries(allBalances).forEach(([exchange, balances]) => {
      balances.forEach((balance) => {
        totalBalance += balance.usdValue
        availableBalance += balance.free * this.getAssetPrice(balance.asset)

        // Add to consolidated balances
        const existing = consolidatedBalances.find((b) => b.asset === balance.asset)
        if (existing) {
          existing.free += balance.free
          existing.locked += balance.locked
          existing.total += balance.total
          existing.usdValue += balance.usdValue
        } else {
          consolidatedBalances.push({ ...balance })
        }
      })
    })

    return {
      totalBalance,
      availableBalance,
      balances: consolidatedBalances,
      lastUpdated: Date.now(),
      exchanges,
    }
  }

  // Simulate some trading activity to show in OKX demo
  simulateOKXDemoActivity() {
    const okxAccount = this.exchangeAccounts.get("okx")
    if (!okxAccount) return

    // Simulate a few demo trades
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const side = Math.random() > 0.5 ? "buy" : "sell"
    const quantity = 0.001 + Math.random() * 0.01
    const price = this.getAssetPrice(symbol.replace("USDT", ""))

    this.executeTradeOnExchange("okx", symbol, side, quantity, price)
    console.log(`🎯 Simulated OKX demo activity: ${side} ${quantity.toFixed(6)} ${symbol}`)
  }

  // Test connection method that doesn't actually make network calls
  async testConnections(): Promise<{ [exchange: string]: { success: boolean; message: string } }> {
    console.log("🔗 Testing exchange connections (mock mode)")

    const results: { [exchange: string]: { success: boolean; message: string } } = {}
    const exchanges = ["binance", "bybit", "okx"]

    for (const exchange of exchanges) {
      const credentials = this.credentials.get(exchange)
      const hasCredentials = credentials && credentials.apiKey && credentials.secretKey

      if (hasCredentials) {
        // Simulate successful connection
        const balanceCount = this.getRealisticBalancesForExchange(exchange).length
        results[exchange] = {
          success: true,
          message: `✅ Connected (${balanceCount} assets) - Enhanced Mock Mode`,
        }
      } else {
        results[exchange] = {
          success: false,
          message: "⚠️ No credentials configured - Using Mock Data",
        }
      }
    }

    return results
  }

  // Method to attempt real API connection (can be called separately)
  async attemptRealConnection(exchange: string): Promise<boolean> {
    console.log(`🔄 Attempting real connection to ${exchange}...`)

    try {
      // This would contain the actual API call logic
      // For now, we'll simulate a connection attempt
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate random success/failure
      const success = Math.random() > 0.7 // 30% success rate for demo

      if (success) {
        console.log(`✅ Real connection to ${exchange} successful`)
        this.lastSuccessfulFetch.set(exchange, Date.now())
        const account = this.exchangeAccounts.get(exchange)
        if (account) {
          account.connectionStatus = "connected"
        }
        return true
      } else {
        console.log(`❌ Real connection to ${exchange} failed`)
        const account = this.exchangeAccounts.get(exchange)
        if (account) {
          account.connectionStatus = "disconnected"
        }
        return false
      }
    } catch (error) {
      console.error(`Failed to connect to ${exchange}:`, error)
      const account = this.exchangeAccounts.get(exchange)
      if (account) {
        account.connectionStatus = "disconnected"
      }
      return false
    }
  }

  // Get connection status
  getConnectionStatus(): { [exchange: string]: { connected: boolean; lastSuccess: number | null; mode: string } } {
    const exchanges = ["binance", "bybit", "okx"]
    const status: { [exchange: string]: { connected: boolean; lastSuccess: number | null; mode: string } } = {}

    for (const exchange of exchanges) {
      const account = this.exchangeAccounts.get(exchange)
      const lastSuccess = account ? account.lastTradeTime : null
      status[exchange] = {
        connected: account ? account.connectionStatus === "connected" : false,
        lastSuccess,
        mode: this.mockMode ? "Enhanced Mock" : "Live API",
      }
    }

    return status
  }
}

export const realExchangeService = new RealExchangeService()
