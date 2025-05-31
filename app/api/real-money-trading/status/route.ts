import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  try {
    // Mock status data - replace with actual trading service status
    const mockStatus = {
      isRunning: false,
      isConnected: true,
      totalTrades: 0,
      successfulTrades: 0,
      totalProfit: 0.0,
      lastTradeTime: null,
      uptime: 0,
    }

    return NextResponse.json({
      success: true,
      isRunning: mockStatus.isRunning,
      status: mockStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching status:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch status",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
