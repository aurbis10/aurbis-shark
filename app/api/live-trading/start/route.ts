import { NextResponse } from "next/server"
import { liveTradingService } from "@/services/live-trading-service"

export const runtime = "edge"

export async function POST() {
  try {
    console.log("🚀 Starting LIVE arbitrage trading with real market scanning...")

    await liveTradingService.startLiveTrading()

    return NextResponse.json({
      success: true,
      message: "LIVE arbitrage trading started - scanning real opportunities",
      status: liveTradingService.getStatus(),
      features: [
        "Real-time market data scanning",
        "Live arbitrage opportunity detection",
        "Automatic trade execution",
        "Risk management active",
        "Multi-exchange monitoring",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start live trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
