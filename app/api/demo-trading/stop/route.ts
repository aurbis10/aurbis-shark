import { NextResponse } from "next/server"
import { demoTradingService } from "@/services/demo-trading-service"

export async function POST() {
  try {
    demoTradingService.stopTrading()

    return NextResponse.json({
      success: true,
      message: "Demo trading stopped successfully",
      status: demoTradingService.getStatus(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to stop demo trading",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
