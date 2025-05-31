import { NextResponse } from "next/server"
import { liveTradingService } from "@/services/live-trading-service"

export const runtime = "edge"

export async function POST() {
  try {
    liveTradingService.stopLiveTrading()

    return NextResponse.json({
      success: true,
      message: "Live trading stopped successfully",
      status: liveTradingService.getStatus(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to stop live trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
