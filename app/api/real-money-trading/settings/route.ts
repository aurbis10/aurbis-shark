import { type NextRequest, NextResponse } from "next/server"
import { defaultTradingSettings, type TradingSettings } from "@/types/trading-settings"

// In-memory storage for settings (in production, use a database)
let currentSettings: TradingSettings = { ...defaultTradingSettings }

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: currentSettings,
    })
  } catch (error) {
    console.error("Failed to get trading settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get trading settings",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate settings
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid settings data",
        },
        { status: 400 },
      )
    }

    // Update settings with validation
    const newSettings: TradingSettings = {
      maxExposurePerTrade: Math.min(
        Math.max(Number(data.maxExposurePerTrade) || currentSettings.maxExposurePerTrade, 0.1),
        5,
      ),
      minSpreadThreshold: Math.min(
        Math.max(Number(data.minSpreadThreshold) || currentSettings.minSpreadThreshold, 1.3),
        5,
      ),
      maxSlippage: Math.min(Math.max(Number(data.maxSlippage) || currentSettings.maxSlippage, 0.1), 1),
      maxDailyTrades: Math.min(Math.max(Number(data.maxDailyTrades) || currentSettings.maxDailyTrades, 10), 100),
      emergencyStopLoss: Math.min(Math.max(Number(data.emergencyStopLoss) || currentSettings.emergencyStopLoss, 5), 20),
      autoRebalance: data.autoRebalance !== undefined ? Boolean(data.autoRebalance) : currentSettings.autoRebalance,
      rebalanceThreshold: Math.min(
        Math.max(Number(data.rebalanceThreshold) || currentSettings.rebalanceThreshold, 5),
        25,
      ),
      enabledPairs: Array.isArray(data.enabledPairs) ? data.enabledPairs : currentSettings.enabledPairs,
    }

    currentSettings = newSettings

    return NextResponse.json({
      success: true,
      settings: currentSettings,
    })
  } catch (error) {
    console.error("Failed to update trading settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update trading settings",
      },
      { status: 500 },
    )
  }
}

export async function PUT() {
  try {
    // Reset to defaults
    currentSettings = { ...defaultTradingSettings }

    return NextResponse.json({
      success: true,
      settings: currentSettings,
      message: "Settings reset to defaults",
    })
  } catch (error) {
    console.error("Failed to reset trading settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset trading settings",
      },
      { status: 500 },
    )
  }
}
