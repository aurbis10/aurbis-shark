import { NextResponse } from "next/server"
import { tradingRulesEngine } from "@/services/trading-rules-engine"

export async function GET() {
  try {
    const rulesByCategory = tradingRulesEngine.getRulesByCategory()

    return NextResponse.json({
      success: true,
      rules: rulesByCategory,
      totalRules: Object.values(rulesByCategory).flat().length,
      categories: Object.keys(rulesByCategory),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get trading rules",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
