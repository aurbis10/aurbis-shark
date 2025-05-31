import { NextResponse } from "next/server"
import { liveTradingService } from "@/services/live-trading-service"

export const runtime = "edge"

export async function GET() {
  try {
    const status = liveTradingService.getStatus()
    const opportunities = liveTradingService.getRecentOpportunities(20)
    const trades = liveTradingService.getRecentTrades(20)
    const marketData = liveTradingService.getMarketData()

    return NextResponse.json({
      success: true,
      status,
      opportunities,
      trades,
      marketData: Object.fromEntries(marketData),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get live trading status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
