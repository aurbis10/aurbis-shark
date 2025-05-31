import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  try {
    // Edge Runtime compatible health checks
    const healthChecks = {
      timestamp: new Date().toISOString(),
      status: "healthy",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      runtime: "edge",
      customKey: process.env.CUSTOM_KEY ? "configured" : "missing",
      database: "not_required", // Since we're using in-memory storage
      apis: {
        binance: {
          live: process.env.BINANCE_API_KEY ? "configured" : "missing",
          testnet: process.env.BINANCE_TESTNET_API_KEY ? "configured" : "missing",
        },
        bybit: {
          live: process.env.BYBIT_API_KEY ? "configured" : "missing",
          testnet: process.env.BYBIT_TESTNET_API_KEY ? "configured" : "missing",
        },
        okx: {
          live: process.env.OKX_API_KEY ? "configured" : "missing",
          demo: process.env.OKX_DEMO_API_KEY ? "configured" : "missing",
        },
      },
      // Edge Runtime doesn't have process.uptime() or process.memoryUsage()
      uptime: "edge_runtime",
      memory: "edge_runtime",
    }

    return NextResponse.json({
      success: true,
      health: healthChecks,
      message: "Aurbis Trading Bot is healthy and operational",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
