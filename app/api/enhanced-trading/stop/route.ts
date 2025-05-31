import { NextResponse } from "next/server"
import { enhancedRealMoneyTradingService } from "@/services/enhanced-real-money-trading"

export async function POST() {
  try {
    enhancedRealMoneyTradingService.stopEnhancedTrading()

    return NextResponse.json({
      success: true,
      message: "Enhanced trading stopped successfully",
      status: enhancedRealMoneyTradingService.getStatus(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to stop enhanced trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
