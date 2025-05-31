import { NextResponse } from "next/server"

// Switch to Node.js runtime for better external API support
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("🔴🔴🔴 FETCHING LIVE ACCOUNT BALANCES - REAL MONEY TRADING 🔴🔴🔴")

    // Check if we have the required environment variables
    const hasCredentials = {
      binance: !!(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY),
      bybit: !!(process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY),
      okx: !!(process.env.OKX_API_KEY && process.env.OKX_SECRET_KEY && process.env.OKX_PASSPHRASE),
    }

    console.log("🔑 API Credentials Check:", hasCredentials)

    // If no credentials are available, return mock data with warning
    if (!hasCredentials.binance && !hasCredentials.bybit && !hasCredentials.okx) {
      console.log("⚠️ NO LIVE API CREDENTIALS FOUND - RETURNING MOCK DATA")

      const mockExchangeBalances = [
        {
          exchange: "binance",
          success: false,
          balances: [],
          totalUsdBalance: 0,
          availableUsdBalance: 0,
          error: "No API credentials configured",
          lastUpdated: Date.now(),
          isLiveAccount: true,
        },
        {
          exchange: "bybit",
          success: false,
          balances: [],
          totalUsdBalance: 0,
          availableUsdBalance: 0,
          error: "No API credentials configured",
          lastUpdated: Date.now(),
          isLiveAccount: true,
        },
        {
          exchange: "okx",
          success: false,
          balances: [],
          totalUsdBalance: 0,
          availableUsdBalance: 0,
          error: "No API credentials configured",
          lastUpdated: Date.now(),
          isLiveAccount: true,
        },
      ]

      return NextResponse.json({
        success: true,
        totalBalance: 0,
        availableBalance: 0,
        hasMinimumFunds: false,
        minimumRequired: 100,
        exchangeBalances: mockExchangeBalances,
        successfulExchanges: 0,
        exchangesWithFunds: 0,
        geoBlockedExchanges: 0,
        failedExchanges: 3,
        lastUpdated: new Date().toISOString(),
        mode: "NO_CREDENTIALS_MOCK_DATA",
        warning: "⚠️ NO LIVE API CREDENTIALS CONFIGURED - ADD YOUR EXCHANGE API KEYS",
        isLiveTrading: false,
        timestamp: new Date().toISOString(),
      })
    }

    // Try to fetch balances with better error handling
    const exchangeBalances = await fetchAllExchangeBalances(hasCredentials)

    // Calculate totals from successful exchanges
    const successfulExchanges = exchangeBalances.filter((exchange) => exchange.success)
    const totalBalance = successfulExchanges.reduce((sum, exchange) => sum + exchange.totalUsdBalance, 0)
    const availableBalance = successfulExchanges.reduce((sum, exchange) => sum + exchange.availableUsdBalance, 0)

    // Check which exchanges have real funds
    const exchangesWithFunds = successfulExchanges.filter((exchange) => exchange.totalUsdBalance > 25)
    const hasMinimumFunds = totalBalance >= 100

    // Check for issues
    const geoBlockedExchanges = exchangeBalances.filter((exchange) => exchange.isGeoBlocked)
    const failedExchanges = exchangeBalances.filter((exchange) => !exchange.success)

    console.log(`🔴💰 TOTAL LIVE BALANCE: $${totalBalance.toFixed(2)} REAL MONEY`)
    console.log(`🔴💵 AVAILABLE FOR TRADING: $${availableBalance.toFixed(2)} REAL MONEY`)
    console.log(`🔴✅ SUCCESSFUL EXCHANGES: ${successfulExchanges.length}/3`)

    return NextResponse.json({
      success: true,
      totalBalance,
      availableBalance,
      hasMinimumFunds,
      minimumRequired: 100,
      exchangeBalances,
      successfulExchanges: successfulExchanges.length,
      exchangesWithFunds: exchangesWithFunds.length,
      geoBlockedExchanges: geoBlockedExchanges.length,
      failedExchanges: failedExchanges.length,
      lastUpdated: new Date().toISOString(),
      mode: "LIVE_PRODUCTION_BALANCES",
      warning: successfulExchanges.length === 0 ? "⚠️ ALL EXCHANGE CONNECTIONS FAILED" : null,
      isLiveTrading: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Failed to fetch LIVE balances:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch LIVE exchange balances",
        details: error instanceof Error ? error.message : "Unknown error",
        totalBalance: 0,
        availableBalance: 0,
        hasMinimumFunds: false,
        exchangeBalances: [],
        isLiveTrading: true,
        warning: "⚠️ LIVE ACCOUNT ACCESS FAILED",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Separate function to handle exchange balance fetching
async function fetchAllExchangeBalances(hasCredentials: any) {
  const results = []

  // Fetch Binance balances
  if (hasCredentials.binance) {
    try {
      const binanceResult = await fetchBinanceBalances()
      results.push(binanceResult)
    } catch (error) {
      console.error("❌ Binance fetch error:", error)
      results.push({
        exchange: "binance",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: error instanceof Error ? error.message : "Failed to fetch",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      })
    }
  } else {
    results.push({
      exchange: "binance",
      success: false,
      balances: [],
      totalUsdBalance: 0,
      availableUsdBalance: 0,
      error: "No API credentials",
      lastUpdated: Date.now(),
      isLiveAccount: true,
    })
  }

  // Fetch Bybit balances
  if (hasCredentials.bybit) {
    try {
      const bybitResult = await fetchBybitBalances()
      results.push(bybitResult)
    } catch (error) {
      console.error("❌ Bybit fetch error:", error)
      results.push({
        exchange: "bybit",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: error instanceof Error ? error.message : "Failed to fetch",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      })
    }
  } else {
    results.push({
      exchange: "bybit",
      success: false,
      balances: [],
      totalUsdBalance: 0,
      availableUsdBalance: 0,
      error: "No API credentials",
      lastUpdated: Date.now(),
      isLiveAccount: true,
    })
  }

  // Fetch OKX balances
  if (hasCredentials.okx) {
    try {
      const okxResult = await fetchOKXBalances()
      results.push(okxResult)
    } catch (error) {
      console.error("❌ OKX fetch error:", error)
      results.push({
        exchange: "okx",
        success: false,
        balances: [],
        totalUsdBalance: 0,
        availableUsdBalance: 0,
        error: error instanceof Error ? error.message : "Failed to fetch",
        lastUpdated: Date.now(),
        isLiveAccount: true,
      })
    }
  } else {
    results.push({
      exchange: "okx",
      success: false,
      balances: [],
      totalUsdBalance: 0,
      availableUsdBalance: 0,
      error: "No API credentials",
      lastUpdated: Date.now(),
      isLiveAccount: true,
    })
  }

  return results
}

// HMAC-SHA256 signing function
async function hmacSha256(key: string, message: string): Promise<string> {
  const crypto = require("crypto")
  return crypto.createHmac("sha256", key).update(message).digest("hex")
}

// Fetch Binance balances with improved error handling
async function fetchBinanceBalances() {
  const apiKey = process.env.BINANCE_API_KEY
  const secretKey = process.env.BINANCE_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error("Missing Binance API credentials")
  }

  console.log("🔴 FETCHING LIVE BINANCE ACCOUNT BALANCE")

  const timestamp = Date.now()
  const queryString = `timestamp=${timestamp}`
  const signature = await hmacSha256(secretKey, queryString)

  const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`

  console.log("🔗 Binance API URL:", url.replace(signature, "***SIGNATURE***"))

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": apiKey,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ Binance API Error Response:", errorText)
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // Convert to our format
  const balances = data.balances
    .filter((b: any) => Number.parseFloat(b.free) > 0 || Number.parseFloat(b.locked) > 0)
    .map((b: any) => ({
      asset: b.asset,
      free: Number.parseFloat(b.free),
      locked: Number.parseFloat(b.locked),
      total: Number.parseFloat(b.free) + Number.parseFloat(b.locked),
      usdValue: getAssetUSDValue(b.asset, Number.parseFloat(b.free) + Number.parseFloat(b.locked)),
    }))

  const totalUsdBalance = balances.reduce((sum: number, b: any) => sum + b.usdValue, 0)
  const availableUsdBalance = balances.reduce((sum: number, b: any) => sum + b.free * getAssetPrice(b.asset), 0)

  console.log(`✅ BINANCE LIVE: $${totalUsdBalance.toFixed(2)} REAL MONEY BALANCE`)

  return {
    exchange: "binance",
    success: true,
    balances,
    totalUsdBalance,
    availableUsdBalance,
    lastUpdated: Date.now(),
    isLiveAccount: true,
  }
}

// Fetch Bybit balances (simplified for now)
async function fetchBybitBalances() {
  // For now, return a mock response to avoid geo-blocking issues
  console.log("⚠️ BYBIT: Using mock data due to potential geo-blocking")

  return {
    exchange: "bybit",
    success: false,
    balances: [],
    totalUsdBalance: 0,
    availableUsdBalance: 0,
    error: "Temporarily disabled due to geo-blocking issues",
    lastUpdated: Date.now(),
    isLiveAccount: true,
    isGeoBlocked: true,
  }
}

// Fetch OKX balances with improved error handling
async function fetchOKXBalances() {
  const apiKey = process.env.OKX_API_KEY
  const secretKey = process.env.OKX_SECRET_KEY
  const passphrase = process.env.OKX_PASSPHRASE

  if (!apiKey || !secretKey || !passphrase) {
    throw new Error("Missing OKX API credentials")
  }

  console.log("🔴 FETCHING LIVE OKX ACCOUNT BALANCE")

  const timestamp = new Date().toISOString()
  const method = "GET"
  const requestPath = "/api/v5/account/balance"
  const body = ""

  const prehash = timestamp + method + requestPath + body
  const signature = await hmacSha256(secretKey, prehash)

  const url = `https://www.okx.com${requestPath}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "OK-ACCESS-KEY": apiKey,
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": passphrase,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ OKX API Error Response:", errorText)
    throw new Error(`OKX API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.code !== "0") {
    throw new Error(`OKX API error: ${data.msg}`)
  }

  // Convert to our format
  const balances =
    data.data[0]?.details
      ?.filter((b: any) => Number.parseFloat(b.cashBal) > 0)
      ?.map((b: any) => ({
        asset: b.ccy,
        free: Number.parseFloat(b.availBal),
        locked: Number.parseFloat(b.frozenBal),
        total: Number.parseFloat(b.cashBal),
        usdValue: getAssetUSDValue(b.ccy, Number.parseFloat(b.cashBal)),
      })) || []

  const totalUsdBalance = balances.reduce((sum: number, b: any) => sum + b.usdValue, 0)
  const availableUsdBalance = balances.reduce((sum: number, b: any) => sum + b.free * getAssetPrice(b.asset), 0)

  console.log(`✅ OKX LIVE: $${totalUsdBalance.toFixed(2)} REAL MONEY BALANCE`)

  return {
    exchange: "okx",
    success: true,
    balances,
    totalUsdBalance,
    availableUsdBalance,
    lastUpdated: Date.now(),
    isLiveAccount: true,
  }
}

// Helper functions
function getAssetPrice(asset: string): number {
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
  }
  return prices[asset] || 1.0
}

function getAssetUSDValue(asset: string, amount: number): number {
  return amount * getAssetPrice(asset)
}
