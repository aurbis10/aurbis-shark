import { NextResponse } from "next/server"
import { demoTradingService } from "@/services/demo-trading-service"

export async function GET() {
  try {
    const status = demoTradingService.getStatus()
    const recentTrades = demoTradingService.getRecentTrades(10)

    return NextResponse.json({
      success: true,
      status,
      recentTrades,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get demo trading status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
