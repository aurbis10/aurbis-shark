import { NextResponse } from "next/server"
import { realMoneyTradingService } from "@/services/real-money-trading-service"

export const runtime = "edge"

export async function POST() {
  try {
    realMoneyTradingService.stop()

    return NextResponse.json({
      success: true,
      message: "Real money trading stopped safely",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to stop real money trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
