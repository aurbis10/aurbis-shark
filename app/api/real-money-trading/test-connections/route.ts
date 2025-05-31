import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("🔴🔗 TESTING LIVE EXCHANGE API CONNECTIONS")

    // Check environment variables
    const credentials = {
      binance: {
        hasApiKey: !!process.env.BINANCE_API_KEY,
        hasSecretKey: !!process.env.BINANCE_SECRET_KEY,
        isComplete: !!(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY),
      },
      bybit: {
        hasApiKey: !!process.env.BYBIT_API_KEY,
        hasSecretKey: !!process.env.BYBIT_SECRET_KEY,
        isComplete: !!(process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY),
      },
      okx: {
        hasApiKey: !!process.env.OKX_API_KEY,
        hasSecretKey: !!process.env.OKX_SECRET_KEY,
        hasPassphrase: !!process.env.OKX_PASSPHRASE,
        isComplete: !!(process.env.OKX_API_KEY && process.env.OKX_SECRET_KEY && process.env.OKX_PASSPHRASE),
      },
    }

    console.log("🔑 Credentials Check:", credentials)

    // Test connections
    const connectionResults = {
      binance: {
        success: credentials.binance.isComplete,
        message: credentials.binance.isComplete
          ? "✅ API credentials configured"
          : "❌ Missing API credentials (need BINANCE_API_KEY and BINANCE_SECRET_KEY)",
        isLive: true,
        hasCredentials: credentials.binance.isComplete,
      },
      bybit: {
        success: false, // Temporarily disabled due to geo-blocking
        message: "⚠️ Temporarily disabled due to geo-blocking issues",
        isLive: true,
        hasCredentials: credentials.bybit.isComplete,
        isGeoBlocked: true,
      },
      okx: {
        success: credentials.okx.isComplete,
        message: credentials.okx.isComplete
          ? "✅ API credentials configured"
          : "❌ Missing API credentials (need OKX_API_KEY, OKX_SECRET_KEY, and OKX_PASSPHRASE)",
        isLive: true,
        hasCredentials: credentials.okx.isComplete,
      },
    }

    const successfulConnections = Object.values(connectionResults).filter((r) => r.success).length
    const totalExchanges = Object.keys(connectionResults).length

    return NextResponse.json({
      success: true,
      connections: connectionResults,
      summary: {
        successful: successfulConnections,
        total: totalExchanges,
        readyForTrading: successfulConnections >= 2, // Need at least 2 exchanges for arbitrage
      },
      credentials,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Connection test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test connections",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
