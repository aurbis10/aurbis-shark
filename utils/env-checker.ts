interface EnvironmentVariable {
  name: string
  isSet: boolean
  value: string
  isValid: boolean
  type: "api_key" | "secret" | "url" | "config"
}

export function checkEnvironmentVariables(): EnvironmentVariable[] {
  const requiredVars = [
    { name: "NODE_ENV", type: "config" as const },
    { name: "NEXT_PUBLIC_VERCEL_URL", type: "url" as const },
    { name: "BINANCE_TESTNET_API_KEY", type: "api_key" as const },
    { name: "BINANCE_TESTNET_SECRET_KEY", type: "secret" as const },
    { name: "BYBIT_TESTNET_API_KEY", type: "api_key" as const },
    { name: "BYBIT_TESTNET_SECRET_KEY", type: "secret" as const },
    { name: "OKX_DEMO_API_KEY", type: "api_key" as const },
    { name: "OKX_DEMO_SECRET_KEY", type: "secret" as const },
    { name: "OKX_DEMO_PASSPHRASE", type: "secret" as const },
    { name: "CUSTOM_KEY", type: "config" as const },
  ]

  return requiredVars.map((variable) => {
    const value = process.env[variable.name]
    const isSet = !!value
    const isValid = isSet && value.length >= (variable.type === "config" ? 1 : 10)

    return {
      name: variable.name,
      isSet,
      value: isSet ? (variable.type === "api_key" || variable.type === "secret" ? "***SET***" : value) : "NOT_SET",
      isValid,
      type: variable.type,
    }
  })
}

export function areAllVariablesValid(): boolean {
  const results = checkEnvironmentVariables()
  return results.every((result) => result.isValid)
}
