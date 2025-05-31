import { NextResponse } from "next/server"
import { realExchangeService } from "@/services/real-exchange-service"

export const runtime = "edge"

export async function GET() {
  try {
    console.log("📊 Fetching detailed exchange information...")

    // Get individual exchange accounts
    const exchanges = realExchangeService.getAllExchangeAccounts()

    // Get trade history for each exchange
    const exchangeDetails = exchanges.map((account) => ({
      ...account,
      recentTrades: realExchangeService.getExchangeTradeHistory(account.exchange, 10),
      credentials: {
        hasApiKey:
          !!process.env[
            `${account.exchange.toUpperCase()}_${account.exchange === "okx" ? "DEMO_" : "TESTNET_"}API_KEY`
          ],
        hasSecret:
          !!process.env[
            `${account.exchange.toUpperCase()}_${account.exchange === "okx" ? "DEMO_" : "TESTNET_"}SECRET_KEY`
          ],
        hasPassphrase: account.exchange === "okx" ? !!process.env.OKX_DEMO_PASSPHRASE : true,
      },
    }))

    // Simulate some OKX activity if no recent trades
    const okxAccount = exchanges.find((e) => e.exchange === "okx")
    if (okxAccount && (!okxAccount.lastTradeTime || Date.now() - okxAccount.lastTradeTime > 30000)) {
      realExchangeService.simulateOKXDemoActivity()
    }

    return NextResponse.json({
      success: true,
      exchanges: exchangeDetails,
      summary: {
        totalExchanges: exchanges.length,
        totalBalance: exchanges.reduce((sum, e) => sum + e.totalUsdBalance, 0),
        totalTrades: exchanges.reduce((sum, e) => sum + e.tradeCount, 0),
        lastActivity: Math.max(...exchanges.map((e) => e.lastTradeTime || 0)),
      },
      timestamp: new Date().toISOString(),
      note: "Individual exchange tracking with simulated OKX demo activity",
    })
  } catch (error) {
    console.error("❌ Error fetching exchange details:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        exchanges: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
