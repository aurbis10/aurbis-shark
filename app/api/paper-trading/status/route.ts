import { NextResponse } from "next/server"
import { paperTradingService } from "@/services/paper-trading-service"

export async function GET() {
  try {
    const status = paperTradingService.getStatus()

    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting paper trading status:", error)
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
