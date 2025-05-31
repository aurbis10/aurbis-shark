import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
}
