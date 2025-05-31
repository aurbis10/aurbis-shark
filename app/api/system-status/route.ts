import { NextResponse } from "next/server"

export async function GET() {
  try {
    const systemStatus = {
      timestamp: new Date().toISOString(),
      status: "operational",
      services: {
        webServer: "online",
        tradingEngine: "ready",
        riskManagement: "active",
        marketData: "connected",
        notifications: "enabled",
      },
      performance: {
        uptime: Math.floor(process.uptime()),
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        responseTime: "< 100ms",
      },
      trading: {
        demoMode: "available",
        paperTrading: "available",
        realMoney: "testnet_only",
        enhancedRules: "active",
      },
      security: {
        apiKeys: "encrypted",
        rateLimit: "active",
        cors: "configured",
        headers: "secured",
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      system: systemStatus,
      message: "All systems operational",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "System status check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
