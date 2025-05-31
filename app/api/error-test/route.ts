import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  // This endpoint is specifically for testing error handling
  return NextResponse.json(
    {
      error: "Not Found",
      message: "This endpoint is used for testing error handling",
      code: 404,
    },
    { status: 404 },
  )
}
