export interface TradingSettings {
  maxExposurePerTrade: number // Percentage of total balance (0-5%)
  minSpreadThreshold: number // Minimum profitable spread (1.3-3%)
  maxSlippage: number // Maximum allowed slippage (0.1-1%)
  maxDailyTrades: number // Maximum trades per day (10-100)
  emergencyStopLoss: number // Emergency stop loss percentage (5-20%)
  autoRebalance: boolean // Auto rebalance wallets
  rebalanceThreshold: number // Threshold for rebalancing (5-25%)
  enabledPairs: string[] // Enabled trading pairs
}

export const defaultTradingSettings: TradingSettings = {
  maxExposurePerTrade: 2.5,
  minSpreadThreshold: 1.5,
  maxSlippage: 0.3,
  maxDailyTrades: 50,
  emergencyStopLoss: 10,
  autoRebalance: true,
  rebalanceThreshold: 15,
  enabledPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
}
