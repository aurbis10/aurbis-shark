import { NextResponse } from "next/server"
import { liveTradingService } from "@/services/live-trading-service"

export const runtime = "edge"

export async function GET() {
  try {
    const opportunities = liveTradingService.scanForOpportunities()
    const marketData = liveTradingService.getMarketData()
    const status = liveTradingService.getStatus()

    return NextResponse.json({
      success: true,
      opportunities,
      marketData: Object.fromEntries(marketData),
      scanTime: new Date().toISOString(),
      isScanning: status.isScanning,
      totalOpportunities: opportunities.length,
      profitableOpportunities: opportunities.filter((op) => op.netSpread > 0.15).length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scan opportunities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
