import { NextResponse } from "next/server"
import { paperTradingService } from "@/services/paper-trading-service"

export async function POST() {
  try {
    const result = await paperTradingService.start()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error starting paper trading:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
