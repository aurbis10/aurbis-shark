import { NextResponse } from "next/server"
import { realMoneyTradingService } from "@/services/real-money-trading-service"

export const runtime = "edge"

export async function POST() {
  try {
    console.log("🚨 REAL MONEY TRADING START REQUEST")

    await realMoneyTradingService.start()

    const status = realMoneyTradingService.getStatus()

    return NextResponse.json({
      success: true,
      message: "🔴 REAL MONEY TRADING STARTED - USING ACTUAL FUNDS",
      status,
      warning: "⚠️ This system will use real money from your exchange accounts",
      balances: realMoneyTradingService.getExchangeBalances(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Failed to start real money trading:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to start real money trading",
        details: error instanceof Error ? error.message : "Unknown error",
        warning: "Real money trading could not be started - this is a safety feature",
      },
      { status: 400 },
    )
  }
}
