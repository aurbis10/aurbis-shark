import { NextResponse } from "next/server"
import { checkEnvironmentVariables, areAllVariablesValid } from "@/utils/env-checker"

export async function GET() {
  try {
    const envResults = checkEnvironmentVariables()
    const allValid = areAllVariablesValid()

    return NextResponse.json({
      success: true,
      allValid,
      variables: envResults,
      summary: {
        total: envResults.length,
        valid: envResults.filter((r) => r.isValid).length,
        invalid: envResults.filter((r) => !r.isValid).length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
