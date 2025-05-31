import { NextResponse } from "next/server"
import { paperTradingService } from "@/services/paper-trading-service"

export async function POST() {
  try {
    const result = paperTradingService.resetBalance()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error resetting paper trading balance:", error)
    return NextResponse.json({ success: false, message: "Failed to reset balance" }, { status: 500 })
  }
}
