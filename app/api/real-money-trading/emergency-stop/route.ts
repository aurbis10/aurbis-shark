import { NextResponse } from "next/server"
import { realMoneyTradingService } from "@/services/real-money-trading-service"

export const runtime = "edge"

export async function POST() {
  try {
    realMoneyTradingService.emergencyStop()

    return NextResponse.json({
      success: true,
      message: "🚨 EMERGENCY STOP ACTIVATED - All real money trading halted",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute emergency stop",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
