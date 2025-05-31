import { NextResponse } from "next/server"
import { demoTradingService } from "@/services/demo-trading-service"

export async function POST() {
  try {
    // Configure realistic arbitrage parameters
    demoTradingService.updateRiskSettings({
      minimumSpread: 0.15, // 0.15% minimum spread (realistic)
      targetROIPerTrade: 0.2, // 0.2% ROI per trade (realistic)
      stopLossPercentage: 1, // 1% stop loss (tight for arbitrage)
      maxDailyTrades: 200, // Higher frequency for arbitrage
      tradingFees: 0.1, // 0.1% per side
      slippageLimit: 0.3, // 0.3% slippage limit
    })

    // Set high-frequency trading speed
    demoTradingService.setTradingSpeed("medium") // 3-second intervals

    // Start the arbitrage system
    await demoTradingService.startTrading()

    const status = demoTradingService.getStatus()

    return NextResponse.json({
      success: true,
      message: "Professional arbitrage system started successfully",
      status,
      parameters: {
        minimumSpread: "0.15% (after fees)",
        targetROI: "0.2% per trade",
        executionSpeed: "3-second intervals",
        stopLoss: "1% (tight for arbitrage)",
        dailyLimit: "200 trades",
        tradingStyle: "High-frequency arbitrage",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start arbitrage system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
