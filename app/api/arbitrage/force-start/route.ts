import { NextResponse } from "next/server"
import { demoTradingService } from "@/services/demo-trading-service"

export async function POST() {
  try {
    // Stop any existing trading first
    demoTradingService.stopTrading()

    // Configure more aggressive arbitrage parameters to ensure trades
    demoTradingService.updateRiskSettings({
      minimumSpread: 0.12, // Lower minimum spread to find more opportunities
      targetROIPerTrade: 0.2, // 0.2% ROI per trade (realistic)
      stopLossPercentage: 1, // 1% stop loss (tight for arbitrage)
      maxDailyTrades: 300, // Higher frequency for arbitrage
      tradingFees: 0.1, // 0.1% per side
      slippageLimit: 0.2, // Lower slippage limit
    })

    // Set high-frequency trading speed
    demoTradingService.setTradingSpeed("fast") // 1-second intervals

    // Start the arbitrage system
    await demoTradingService.startTrading()

    const status = demoTradingService.getStatus()

    return NextResponse.json({
      success: true,
      message: "Arbitrage system FORCE STARTED - actively trading",
      status,
      parameters: {
        minimumSpread: "0.12% (after fees)",
        targetROI: "0.2% per trade",
        executionSpeed: "1-second intervals",
        stopLoss: "1% (tight for arbitrage)",
        dailyLimit: "300 trades",
        tradingStyle: "Aggressive high-frequency arbitrage",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to force-start arbitrage system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
