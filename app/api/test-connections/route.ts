import { NextResponse } from "next/server"
import crypto from "crypto"

interface ConnectionResult {
  exchange: string
  status: "success" | "error" | "unauthorized" | "warning"
  message: string
  latency?: number
  endpoint: string
  accountType: "demo" | "testnet" | "live" | "unknown"
}

async function testBinanceTestnet(): Promise<ConnectionResult> {
  const startTime = Date.now()

  try {
    // Prioritize testnet credentials
    const apiKey = process.env.BINANCE_TESTNET_API_KEY
    const secretKey = process.env.BINANCE_TESTNET_SECRET_KEY

    if (!apiKey || !secretKey) {
      return {
        exchange: "Binance",
        status: "error",
        message:
          "Testnet API credentials not found. Please configure BINANCE_TESTNET_API_KEY and BINANCE_TESTNET_SECRET_KEY",
        endpoint: "testnet.binance.vision",
        accountType: "unknown",
      }
    }

    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}`
    const signature = crypto.createHmac("sha256", secretKey).update(queryString).digest("hex")

    const response = await fetch(
      `https://testnet.binance.vision/api/v3/account?${queryString}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": apiKey,
        },
      },
    )

    const latency = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      return {
        exchange: "Binance",
        status: "success",
        message: `✅ Testnet connection successful! Account has ${data.balances?.length || 0} assets`,
        latency,
        endpoint: "testnet.binance.vision",
        accountType: "testnet",
      }
    } else {
      const errorText = await response.text()
      return {
        exchange: "Binance",
        status: response.status === 401 ? "unauthorized" : "error",
        message: `Testnet connection failed: ${errorText}`,
        latency,
        endpoint: "testnet.binance.vision",
        accountType: "testnet",
      }
    }
  } catch (error) {
    return {
      exchange: "Binance",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      endpoint: "testnet.binance.vision",
      accountType: "unknown",
    }
  }
}

async function testBybitTestnet(): Promise<ConnectionResult> {
  const startTime = Date.now()

  try {
    // Prioritize testnet credentials
    const apiKey = process.env.BYBIT_TESTNET_API_KEY
    const secretKey = process.env.BYBIT_TESTNET_SECRET_KEY

    if (!apiKey || !secretKey) {
      return {
        exchange: "Bybit",
        status: "error",
        message:
          "Testnet API credentials not found. Please configure BYBIT_TESTNET_API_KEY and BYBIT_TESTNET_SECRET_KEY",
        endpoint: "api-testnet.bybit.com",
        accountType: "unknown",
      }
    }

    const timestamp = Date.now()
    const recvWindow = 5000
    const queryString = `api_key=${apiKey}&timestamp=${timestamp}&recv_window=${recvWindow}`
    const signature = crypto.createHmac("sha256", secretKey).update(queryString).digest("hex")

    const response = await fetch(
      `https://api-testnet.bybit.com/v5/account/wallet-balance?category=spot&${queryString}&sign=${signature}`,
    )

    const latency = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      return {
        exchange: "Bybit",
        status: "success",
        message: `✅ Testnet connection successful! Wallet balance retrieved`,
        latency,
        endpoint: "api-testnet.bybit.com",
        accountType: "testnet",
      }
    } else {
      const errorText = await response.text()
      return {
        exchange: "Bybit",
        status: response.status === 401 ? "unauthorized" : "error",
        message: `Testnet connection failed: ${errorText}`,
        latency,
        endpoint: "api-testnet.bybit.com",
        accountType: "testnet",
      }
    }
  } catch (error) {
    return {
      exchange: "Bybit",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      endpoint: "api-testnet.bybit.com",
      accountType: "unknown",
    }
  }
}

async function testOKXDemo(): Promise<ConnectionResult> {
  const startTime = Date.now()

  try {
    // Prioritize demo credentials
    const apiKey = process.env.OKX_DEMO_API_KEY
    const secretKey = process.env.OKX_DEMO_SECRET_KEY
    const passphrase = process.env.OKX_DEMO_PASSPHRASE

    if (!apiKey || !secretKey || !passphrase) {
      return {
        exchange: "OKX",
        status: "error",
        message:
          "Demo API credentials not found. Please configure OKX_DEMO_API_KEY, OKX_DEMO_SECRET_KEY, and OKX_DEMO_PASSPHRASE",
        endpoint: "www.okx.com (demo mode)",
        accountType: "unknown",
      }
    }

    const timestamp = new Date().toISOString()
    const method = "GET"
    const requestPath = "/api/v5/account/balance"
    const body = ""

    const prehashString = timestamp + method + requestPath + body
    const signature = crypto.createHmac("sha256", secretKey).update(prehashString).digest("base64")

    const response = await fetch(`https://www.okx.com${requestPath}`, {
      headers: {
        "OK-ACCESS-KEY": apiKey,
        "OK-ACCESS-SIGN": signature,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": passphrase,
        "Content-Type": "application/json",
        "x-simulated-trading": "1", // Demo trading header
      },
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      return {
        exchange: "OKX",
        status: "success",
        message: `✅ Demo connection successful! Account balance retrieved`,
        latency,
        endpoint: "www.okx.com (demo mode)",
        accountType: "demo",
      }
    } else {
      const errorText = await response.text()
      return {
        exchange: "OKX",
        status: response.status === 401 ? "unauthorized" : "error",
        message: `Demo connection failed: ${errorText}`,
        latency,
        endpoint: "www.okx.com (demo mode)",
        accountType: "demo",
      }
    }
  } catch (error) {
    return {
      exchange: "OKX",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      endpoint: "www.okx.com (demo mode)",
      accountType: "unknown",
    }
  }
}

export async function GET() {
  try {
    const [binanceResult, bybitResult, okxResult] = await Promise.all([
      testBinanceTestnet(),
      testBybitTestnet(),
      testOKXDemo(),
    ])

    const results = [binanceResult, bybitResult, okxResult]
    const successCount = results.filter((r) => r.status === "success").length
    const allConnected = successCount === results.length

    return NextResponse.json({
      success: true,
      allConnected,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        readyForTrading: allConnected,
      },
      results,
      message: allConnected
        ? "🎉 All demo/testnet connections successful! Ready for 24/7 trading simulation."
        : "Some connections failed. Please check your demo/testnet credentials.",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test connections",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
