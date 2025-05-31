import { NextResponse } from "next/server"
import { realArbitrageService } from "@/services/real-arbitrage-service"

export const runtime = "edge"

export async function GET() {
  try {
    const status = realArbitrageService.getStatus()
    const recentTrades = realArbitrageService.getRecentTrades(20)
    const marketData = realArbitrageService.getMarketData()

    // Convert Map to object for JSON serialization
    const marketDataObj: { [key: string]: any } = {}
    marketData.forEach((value, key) => {
      marketDataObj[key] = value
    })

    return NextResponse.json({
      success: true,
      status,
      recentTrades,
      marketData: marketDataObj,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get real arbitrage status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
