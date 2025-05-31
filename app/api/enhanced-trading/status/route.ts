import { NextResponse } from "next/server"
import { enhancedRealMoneyTradingService } from "@/services/enhanced-real-money-trading"

export async function GET() {
  try {
    const status = enhancedRealMoneyTradingService.getStatus()
    const opportunities = enhancedRealMoneyTradingService.getOpportunities()
    const executedTrades = enhancedRealMoneyTradingService.getExecutedTrades()
    const ruleStats = enhancedRealMoneyTradingService.getRuleValidationStats()

    return NextResponse.json({
      success: true,
      status,
      opportunities,
      executedTrades,
      ruleStats,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get enhanced trading status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
