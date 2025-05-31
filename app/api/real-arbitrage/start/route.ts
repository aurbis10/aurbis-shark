import { NextResponse } from "next/server"
import { realArbitrageService } from "@/services/real-arbitrage-service"

export const runtime = "edge"

export async function POST() {
  try {
    await realArbitrageService.start()

    return NextResponse.json({
      success: true,
      message: "REAL arbitrage system started with live market data",
      status: realArbitrageService.getStatus(),
      note: "System is now connected to market simulation and monitoring live prices",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start real arbitrage system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
