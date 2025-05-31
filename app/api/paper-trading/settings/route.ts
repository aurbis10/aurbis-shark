import { type NextRequest, NextResponse } from "next/server"
import { paperTradingService } from "@/services/paper-trading-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stakePerTrade, maxConcurrentTrades, maxDailyTrades, minSpreadThreshold } = body

    const result = paperTradingService.updateSettings({
      stakePerTrade: Number.parseFloat(stakePerTrade),
      maxConcurrentTrades: Number.parseInt(maxConcurrentTrades),
      maxDailyTrades: Number.parseInt(maxDailyTrades),
      minSpreadThreshold: Number.parseFloat(minSpreadThreshold),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating paper trading settings:", error)
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const settings = paperTradingService.getSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Error getting paper trading settings:", error)
    return NextResponse.json({ success: false, message: "Failed to get settings" }, { status: 500 })
  }
}
