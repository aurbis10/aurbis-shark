import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const host = request.headers.get("host")
  const isLocalhost = host?.includes("localhost") || host?.includes("127.0.0.1")

  return NextResponse.json({
    success: true,
    environment: {
      host,
      isLocalhost,
      port: host?.split(":")[1] || "3000",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
    endpoints: {
      dashboard: `http://${host}`,
      setup: `http://${host}/setup`,
      demoTrading: `http://${host}/continuous-demo`,
      diagnostics: `http://${host}/diagnostics`,
      performance: `http://${host}/performance`,
    },
    api: {
      deploymentTest: `http://${host}/api/deployment-test`,
      checkEnv: `http://${host}/api/check-env`,
      testConnections: `http://${host}/api/test-connections`,
      devStatus: `http://${host}/api/dev-status`,
    },
  })
}
