// LIVE PRODUCTION Exchange API Service for REAL MONEY TRADING
interface ExchangeCredentials {
  apiKey: string
  secretKey: string
  passphrase?: string
  isLive: boolean
}

interface RealBalance {
  asset: string
  free: number
  locked: number
  total: number
  usdValue: number
}

interface ExchangeBalanceResponse {
  exchange: string
  success: boolean
  balances: RealBalance[]
  totalUsdBalance: number
  availableUsdBalance: number
  error?: string
  lastUpdated: number
  isLiveAccount: boolean
  isGeoBlocked?: boolean
}

class RealExchangeAPIService {
  private credentials: Map<string, ExchangeCredentials> = new Map()

  constructor() {
    this.loadLiveCredentials()
  }

  private loadLiveCredentials() {
    // ⚠️ LOADING LIVE PRODUCTION API CREDENTIALS ⚠️
    console.log("🔴 LOADING LIVE PRODUCTION API CREDENTIALS - REAL MONEY TRADING")

    const binanceLive = {
      apiKey: process.env.BINANCE_API_KEY || "",
      secretKey: process.env.BINANCE_SECRET_KEY || "",
      isLive: true,
    }

    const bybitLive = {
      apiKey: process.env.BYBIT_API_KEY || "",
      secretKey: process.env.BYBIT_SECRET_KEY || "",
      isLive: true,
    }

    const okxLive = {
      apiKey: process.env.OKX_API_KEY || "",
      secretKey: process.env.OKX_SECRET_KEY || "",
      passphrase: process.env.OKX_PASSPHRASE || "",
      isLive: true,
    }

    this.credentials.set("binance", binanceLive)
    this.credentials.set("bybit", bybitLive)
    this.credentials.set("okx", okxLive)

    console.log("🔴 LIVE PRODUCTION API CREDENTIALS LOADED FOR REAL MONEY TRADING")
    console.log("⚠️ WARNING: THIS WILL ACCESS YOUR ACTUAL EXCHANGE ACCOUNTS WITH REAL FUNDS")
  }

  // HMAC-SHA256 signing for API authentication
  private async hmacSha256(key: string, message: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(key)
    const messageData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Check if error is due to geographical blocking
  private isGeoBlockedError(error: string): boolean {
    const geoBlockIndicators = [
      "cloudfront",
      "configured to block access from your country",
      "403",
      "The request could not be satisfied",
      "blocked access",
      "geographical",
      "region",
    ]

    const errorLower = error.toLowerCase()
    return geoBlockIndicators.some((indicator) => errorLower.includes(indicator))
  }

  // Fetch LIVE balances from Binance PRODUCTION
  async fetchBinanceBalances(): Promise<ExchangeBalanceResponse> {
    const credentials = this.credentials.get("binance")
    if (!credentials || !credentials.apiKey || !credentials.secretKey) {
      return {
        exchange: "binance",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: "Missing LIVE Binance API credentials",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      }
    }

    try {
      console.log("🔴 FETCHING LIVE BINANCE ACCOUNT BALANCE - REAL MONEY")

      const timestamp = Date.now()
      const queryString = `timestamp=${timestamp}`
      const signature = await this.hmacSha256(credentials.secretKey, queryString)

      // 🔴 LIVE PRODUCTION BINANCE API ENDPOINT
      const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`

      const response = await fetch(url, {
        headers: {
          "X-MBX-APIKEY": credentials.apiKey,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        const isGeoBlocked = this.isGeoBlockedError(errorText)

        throw new Error(
          `Binance LIVE API error: ${response.status} ${response.statusText}${isGeoBlocked ? " (GEO-BLOCKED)" : ""}`,
        )
      }

      const data = await response.json()

      // Convert Binance response to our format
      const balances: RealBalance[] = data.balances
        .filter((b: any) => Number.parseFloat(b.free) > 0 || Number.parseFloat(b.locked) > 0)
        .map((b: any) => ({
          asset: b.asset,
          free: Number.parseFloat(b.free),
          locked: Number.parseFloat(b.locked),
          total: Number.parseFloat(b.free) + Number.parseFloat(b.locked),
          usdValue: this.getAssetUSDValue(b.asset, Number.parseFloat(b.free) + Number.parseFloat(b.locked)),
        }))

      const totalUsdBalance = balances.reduce((sum, b) => sum + b.usdValue, 0)
      const availableUsdBalance = balances.reduce((sum, b) => sum + b.free * this.getAssetPrice(b.asset), 0)

      console.log(`🔴 BINANCE LIVE: $${totalUsdBalance.toFixed(2)} REAL MONEY BALANCE`)

      return {
        exchange: "binance",
        success: true,
        balances,
        totalUsdBalance,
        availableUsdBalance,
        lastUpdated: Date.now(),
        isLiveAccount: true,
      }
    } catch (error) {
      console.error("❌ Binance LIVE API error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const isGeoBlocked = this.isGeoBlockedError(errorMessage)

      return {
        exchange: "binance",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: errorMessage,
        lastUpdated: Date.now(),
        isLiveAccount: true,
        isGeoBlocked,
      }
    }
  }

  // Fetch LIVE balances from Bybit PRODUCTION with multiple endpoint fallbacks
  async fetchBybitBalances(): Promise<ExchangeBalanceResponse> {
    const credentials = this.credentials.get("bybit")
    if (!credentials || !credentials.apiKey || !credentials.secretKey) {
      return {
        exchange: "bybit",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: "Missing LIVE Bybit API credentials",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      }
    }

    // Try multiple Bybit endpoints in case of geo-blocking
    const endpoints = [
      "https://api.bybit.com",
      "https://api.bytick.com", // Alternative domain
      "https://api.bybit.com", // Fallback to original
    ]

    for (let i = 0; i < endpoints.length; i++) {
      const baseUrl = endpoints[i]

      try {
        console.log(`🔴 FETCHING LIVE BYBIT ACCOUNT BALANCE - REAL MONEY (Attempt ${i + 1}/${endpoints.length})`)

        const timestamp = Date.now().toString()
        const recv_window = "5000"

        // Use Bybit V5 API with proper authentication
        const params = new URLSearchParams({
          api_key: credentials.apiKey,
          timestamp: timestamp,
          recv_window: recv_window,
          accountType: "UNIFIED",
        })

        const queryString = params.toString()
        const signature = await this.hmacSha256(credentials.secretKey, queryString)

        const url = `${baseUrl}/v5/account/wallet-balance?${queryString}&sign=${signature}`

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          const errorText = await response.text()
          const isGeoBlocked = this.isGeoBlockedError(errorText)

          if (isGeoBlocked && i < endpoints.length - 1) {
            console.log(`⚠️ Bybit endpoint ${baseUrl} is geo-blocked, trying next endpoint...`)
            continue // Try next endpoint
          }

          throw new Error(
            `Bybit LIVE API error: ${response.status} ${response.statusText}${isGeoBlocked ? " (GEO-BLOCKED)" : ""}`,
          )
        }

        const data = await response.json()

        if (data.retCode !== 0) {
          throw new Error(`Bybit LIVE API error: ${data.retMsg}`)
        }

        // Convert Bybit V5 response to our format
        const balances: RealBalance[] = []

        if (data.result?.list?.[0]?.coin) {
          data.result.list[0].coin.forEach((coin: any) => {
            const total = Number.parseFloat(coin.walletBalance)
            const free = Number.parseFloat(coin.availableToWithdraw)
            const locked = total - free

            if (total > 0) {
              balances.push({
                asset: coin.coin,
                free,
                locked,
                total,
                usdValue: this.getAssetUSDValue(coin.coin, total),
              })
            }
          })
        }

        const totalUsdBalance = balances.reduce((sum, b) => sum + b.usdValue, 0)
        const availableUsdBalance = balances.reduce((sum, b) => sum + b.free * this.getAssetPrice(b.asset), 0)

        console.log(`🔴 BYBIT LIVE: $${totalUsdBalance.toFixed(2)} REAL MONEY BALANCE (via ${baseUrl})`)

        return {
          exchange: "bybit",
          success: true,
          balances,
          totalUsdBalance,
          availableUsdBalance,
          lastUpdated: Date.now(),
          isLiveAccount: true,
        }
      } catch (error) {
        console.error(`❌ Bybit LIVE API error (${baseUrl}):`, error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        const isGeoBlocked = this.isGeoBlockedError(errorMessage)

        // If this is the last endpoint and we still have errors, return the error
        if (i === endpoints.length - 1) {
          return {
            exchange: "bybit",
            success: false,
            balances: [],
            totalUsdBalance: 0,
            availableUsdBalance: 0,
            error: isGeoBlocked ? "Bybit API is geo-blocked in your region. All endpoints failed." : errorMessage,
            lastUpdated: Date.now(),
            isLiveAccount: true,
            isGeoBlocked,
          }
        }

        // Continue to next endpoint if geo-blocked
        if (isGeoBlocked) {
          console.log(`⚠️ Endpoint ${baseUrl} geo-blocked, trying next...`)
          continue
        }
      }
    }

    // This should never be reached, but just in case
    return {
      exchange: "bybit",
      success: false,
      balances: [],
      totalUsdBalance: 0,
      availableUsdBalance: 0,
      error: "All Bybit endpoints failed",
      lastUpdated: Date.now(),
      isLiveAccount: true,
      isGeoBlocked: true,
    }
  }

  // Fetch LIVE balances from OKX PRODUCTION
  async fetchOKXBalances(): Promise<ExchangeBalanceResponse> {
    const credentials = this.credentials.get("okx")
    if (!credentials || !credentials.apiKey || !credentials.secretKey || !credentials.passphrase) {
      return {
        exchange: "okx",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: "Missing LIVE OKX API credentials",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      }
    }

    try {
      console.log("🔴 FETCHING LIVE OKX ACCOUNT BALANCE - REAL MONEY")

      const timestamp = new Date().toISOString()
      const method = "GET"
      const requestPath = "/api/v5/account/balance"
      const body = ""

      const prehash = timestamp + method + requestPath + body
      const signature = await this.hmacSha256(credentials.secretKey, prehash)

      // 🔴 LIVE PRODUCTION OKX API ENDPOINT
      const url = `https://www.okx.com${requestPath}`

      const response = await fetch(url, {
        headers: {
          "OK-ACCESS-KEY": credentials.apiKey,
          "OK-ACCESS-SIGN": signature,
          "OK-ACCESS-TIMESTAMP": timestamp,
          "OK-ACCESS-PASSPHRASE": credentials.passphrase,
          "Content-Type": "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        const isGeoBlocked = this.isGeoBlockedError(errorText)

        throw new Error(
          `OKX LIVE API error: ${response.status} ${response.statusText}${isGeoBlocked ? " (GEO-BLOCKED)" : ""}`,
        )
      }

      const data = await response.json()

      if (data.code !== "0") {
        throw new Error(`OKX LIVE API error: ${data.msg}`)
      }

      // Convert OKX response to our format
      const balances: RealBalance[] =
        data.data[0]?.details
          ?.filter((b: any) => Number.parseFloat(b.cashBal) > 0)
          ?.map((b: any) => ({
            asset: b.ccy,
            free: Number.parseFloat(b.availBal),
            locked: Number.parseFloat(b.frozenBal),
            total: Number.parseFloat(b.cashBal),
            usdValue: this.getAssetUSDValue(b.ccy, Number.parseFloat(b.cashBal)),
          })) || []

      const totalUsdBalance = balances.reduce((sum, b) => sum + b.usdValue, 0)
      const availableUsdBalance = balances.reduce((sum, b) => sum + b.free * this.getAssetPrice(b.asset), 0)

      console.log(`🔴 OKX LIVE: $${totalUsdBalance.toFixed(2)} REAL MONEY BALANCE`)

      return {
        exchange: "okx",
        success: true,
        balances,
        totalUsdBalance,
        availableUsdBalance,
        lastUpdated: Date.now(),
        isLiveAccount: true,
      }
    } catch (error) {
      console.error("❌ OKX LIVE API error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const isGeoBlocked = this.isGeoBlockedError(errorMessage)

      return {
        exchange: "okx",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: errorMessage,
        lastUpdated: Date.now(),
        isLiveAccount: true,
        isGeoBlocked,
      }
    }
  }

  // Get real-time asset prices (simplified - use proper price feeds in production)
  private getAssetPrice(asset: string): number {
    // In production, fetch from CoinGecko, CoinMarketCap, or exchange APIs
    const prices: { [key: string]: number } = {
      USDT: 1.0,
      USDC: 1.0,
      BUSD: 1.0,
      BTC: 43500,
      ETH: 2650,
      SOL: 102,
      ADA: 0.46,
      DOT: 7.8,
      BNB: 310,
      MATIC: 0.85,
      AVAX: 38,
      LINK: 15.5,
      UNI: 6.2,
      AAVE: 98,
      XRP: 0.52,
    }
    return prices[asset] || 1.0
  }

  private getAssetUSDValue(asset: string, amount: number): number {
    return amount * this.getAssetPrice(asset)
  }

  // Fetch LIVE balances from ALL exchanges with error resilience
  async fetchAllRealBalances(): Promise<ExchangeBalanceResponse[]> {
    console.log("🔴🔴🔴 FETCHING LIVE BALANCES FROM ALL EXCHANGES - REAL MONEY 🔴🔴🔴")

    const [binanceResult, bybitResult, okxResult] = await Promise.allSettled([
      this.fetchBinanceBalances(),
      this.fetchBybitBalances(),
      this.fetchOKXBalances(),
    ])

    // Extract results, handling any rejections
    const results: ExchangeBalanceResponse[] = [
      binanceResult.status === "fulfilled"
        ? binanceResult.value
        : {
            exchange: "binance",
            success: false,
            balances: [],
            totalUsdBalance: 0,
            availableUsdBalance: 0,
            error: "Request failed or timed out",
            lastUpdated: Date.now(),
            isLiveAccount: true,
          },
      bybitResult.status === "fulfilled"
        ? bybitResult.value
        : {
            exchange: "bybit",
            success: false,
            balances: [],
            totalUsdBalance: 0,
            availableUsdBalance: 0,
            error: "Request failed or timed out",
            lastUpdated: Date.now(),
            isLiveAccount: true,
          },
      okxResult.status === "fulfilled"
        ? okxResult.value
        : {
            exchange: "okx",
            success: false,
            balances: [],
            totalUsdBalance: 0,
            availableUsdBalance: 0,
            error: "Request failed or timed out",
            lastUpdated: Date.now(),
            isLiveAccount: true,
          },
    ]

    const totalBalance = results.reduce((sum, r) => sum + r.totalUsdBalance, 0)
    const successfulExchanges = results.filter((r) => r.success).length
    const geoBlockedExchanges = results.filter((r) => r.isGeoBlocked).length

    console.log(`🔴💰 TOTAL LIVE ACCOUNT BALANCE: $${totalBalance.toFixed(2)} REAL MONEY`)
    console.log(`✅ SUCCESSFUL CONNECTIONS: ${successfulExchanges}/3`)
    if (geoBlockedExchanges > 0) {
      console.log(`🚫 GEO-BLOCKED EXCHANGES: ${geoBlockedExchanges}/3`)
    }

    return results
  }

  // Test ALL live exchange connections
  async testAllConnections(): Promise<{
    [exchange: string]: { success: boolean; message: string; isLive: boolean; isGeoBlocked?: boolean }
  }> {
    console.log("🔴🔗 TESTING LIVE EXCHANGE API CONNECTIONS - REAL MONEY ACCOUNTS")

    const results = await this.fetchAllRealBalances()

    return {
      binance: {
        success: results[0].success,
        message: results[0].success
          ? `🔴 LIVE CONNECTED ($${results[0].totalUsdBalance.toFixed(2)} real funds)`
          : `❌ LIVE CONNECTION FAILED: ${results[0].error}`,
        isLive: true,
        isGeoBlocked: results[0].isGeoBlocked,
      },
      bybit: {
        success: results[1].success,
        message: results[1].success
          ? `🔴 LIVE CONNECTED ($${results[1].totalUsdBalance.toFixed(2)} real funds)`
          : `❌ LIVE CONNECTION FAILED: ${results[1].error}`,
        isLive: true,
        isGeoBlocked: results[1].isGeoBlocked,
      },
      okx: {
        success: results[2].success,
        message: results[2].success
          ? `🔴 LIVE CONNECTED ($${results[2].totalUsdBalance.toFixed(2)} real funds)`
          : `❌ LIVE CONNECTION FAILED: ${results[2].error}`,
        isLive: true,
        isGeoBlocked: results[2].isGeoBlocked,
      },
    }
  }
}

export const realExchangeAPIService = new RealExchangeAPIService()
