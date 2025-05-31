import { NextResponse } from "next/server"
import { enhancedRealMoneyTradingService } from "@/services/enhanced-real-money-trading"

export async function POST() {
  try {
    await enhancedRealMoneyTradingService.startEnhancedTrading()

    return NextResponse.json({
      success: true,
      message: "Enhanced trading started with professional rules engine",
      status: enhancedRealMoneyTradingService.getStatus(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start enhanced trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
