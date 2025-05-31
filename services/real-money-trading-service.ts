// Add this function to the service to load settings before executing trades

async function loadTradingSettings() {
  try {
    const response = await fetch("http://localhost:3000/api/real-money-trading/settings")
    const data = await response.json()

    if (data.success && data.settings) {
      return data.settings
    }

    // Return default settings if fetch fails
    return {
      maxExposurePerTrade: 2.5,
      minSpreadThreshold: 1.5,
      maxSlippage: 0.3,
      maxDailyTrades: 50,
      emergencyStopLoss: 10,
      autoRebalance: true,
      rebalanceThreshold: 15,
      enabledPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
    }
  } catch (error) {
    console.error("Failed to load trading settings:", error)
    // Return default settings if fetch fails
    return {
      maxExposurePerTrade: 2.5,
      minSpreadThreshold: 1.5,
      maxSlippage: 0.3,
      maxDailyTrades: 50,
      emergencyStopLoss: 10,
      autoRebalance: true,
      rebalanceThreshold: 15,
      enabledPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
    }
  }
}

// Update the executeArbitrage function to use the settings
// Find the executeArbitrage function and modify it to include:

async function executeArbitrage() {
  // Load trading settings
  const settings = await loadTradingSettings()

  // Use settings in your trading logic
  // For example:
  // - Only trade pairs in settings.enabledPairs
  // - Use settings.maxExposurePerTrade to calculate position size
  // - Check if spread > settings.minSpreadThreshold before executing
  // - Implement emergency stop if drawdown > settings.emergencyStopLoss

  // Rest of the function remains the same...
}
