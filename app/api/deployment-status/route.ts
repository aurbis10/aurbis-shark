import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      buildTime: process.env.VERCEL_GIT_COMMIT_SHA ? "vercel_build" : "local_build",
      environment: process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || "local",
      url: process.env.VERCEL_URL || "localhost:3000",
      features: {
        demoTrading: true,
        paperTrading: true,
        realMoneyTrading: true,
        enhancedTrading: true,
        riskManagement: true,
        multiExchange: true,
        realTimeData: true,
        professionalRules: true,
      },
      exchanges: {
        binance: {
          testnet: !!process.env.BINANCE_TESTNET_API_KEY,
          live: !!process.env.BINANCE_API_KEY,
        },
        bybit: {
          testnet: !!process.env.BYBIT_TESTNET_API_KEY,
          live: !!process.env.BYBIT_API_KEY,
        },
        okx: {
          demo: !!process.env.OKX_DEMO_API_KEY,
          live: !!process.env.OKX_API_KEY,
        },
      },
      customConfiguration: {
        customKey: !!process.env.CUSTOM_KEY,
      },
      readyForProduction: true,
    }

    return NextResponse.json({
      success: true,
      deployment: deploymentInfo,
      message: "Deployment status retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get deployment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
