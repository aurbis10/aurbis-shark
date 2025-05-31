import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  try {
    const envVars = [
      "NODE_ENV",
      "VERCEL",
      "VERCEL_URL",
      "NEXT_PUBLIC_VERCEL_URL",
      "VERCEL_REGION",
      "VERCEL_GIT_COMMIT_SHA",
      "VERCEL_GIT_COMMIT_REF",
      "BINANCE_TESTNET_API_KEY",
      "BYBIT_TESTNET_API_KEY",
      "OKX_DEMO_API_KEY",
    ]

    const envStatus = envVars.map((varName) => ({
      name: varName,
      isSet: !!process.env[varName],
      value:
        varName.includes("KEY") || varName.includes("SECRET")
          ? process.env[varName]
            ? "***SET***"
            : "NOT_SET"
          : process.env[varName] || "NOT_SET",
    }))

    const allRequired = envStatus
      .filter((env) => env.name.includes("API_KEY") || env.name.includes("SECRET"))
      .every((env) => env.isSet)

    return NextResponse.json({
      status: "success",
      allRequired,
      environment: envStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
