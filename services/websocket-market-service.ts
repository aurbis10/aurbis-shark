// Edge Runtime compatible market service
interface MarketData {
  exchange: string
  symbol: string
  price: number
  timestamp: number
  volume: number
  bid: number
  ask: number
}

interface ArbitrageOpportunity {
  symbol: string
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  spread: number
  volume: number
  timestamp: number
}

class WebSocketMarketService {
  private marketData: Map<string, MarketData> = new Map()
  private opportunities: ArbitrageOpportunity[] = []
  private isConnected = false
  private listeners: ((opportunity: ArbitrageOpportunity) => void)[] = []
  private simulationInterval: NodeJS.Timeout | null = null

  async connect() {
    console.log("🔗 Starting market data simulation (Edge Runtime compatible)...")

    try {
      this.isConnected = true
      console.log("✅ Market simulation connected!")

      // Start realistic market simulation
      this.startMarketSimulation()
      this.startArbitrageMonitoring()
    } catch (error) {
      console.error("❌ Failed to start market simulation:", error)
      throw error
    }
  }

  private startMarketSimulation() {
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "DOTUSDT"]
    const exchanges = ["binance", "bybit", "okx"]

    // Simulate realistic market data updates
    this.simulationInterval = setInterval(() => {
      symbols.forEach((symbol) => {
        exchanges.forEach((exchange) => {
          const basePrice = this.getRealisticPrice(symbol)
          const spread = 0.001 + Math.random() * 0.002 // 0.1% to 0.3% spread

          const marketData: MarketData = {
            exchange,
            symbol,
            price: basePrice,
            timestamp: Date.now(),
            volume: 1000 + Math.random() * 9000,
            bid: basePrice * (1 - spread / 2),
            ask: basePrice * (1 + spread / 2),
          }

          this.updateMarketData(exchange, symbol, marketData)
        })
      })
    }, 1000) // Update every second
  }

  private getRealisticPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      BTCUSDT: 43000 + (Math.random() - 0.5) * 1000,
      ETHUSDT: 2600 + (Math.random() - 0.5) * 100,
      SOLUSDT: 100 + (Math.random() - 0.5) * 5,
      ADAUSDT: 0.45 + (Math.random() - 0.5) * 0.02,
      DOTUSDT: 7.5 + (Math.random() - 0.5) * 0.3,
    }

    return basePrices[symbol] || 100
  }

  private updateMarketData(exchange: string, symbol: string, data: MarketData) {
    const key = `${exchange}-${symbol}`
    this.marketData.set(key, data)
    this.checkArbitrageOpportunities(symbol)
  }

  private checkArbitrageOpportunities(symbol: string) {
    const exchanges = ["binance", "bybit", "okx"]
    const prices: { exchange: string; price: number; bid: number; ask: number }[] = []

    for (const exchange of exchanges) {
      const key = `${exchange}-${symbol}`
      const data = this.marketData.get(key)

      if (data && Date.now() - data.timestamp < 5000) {
        prices.push({
          exchange: exchange,
          price: data.price,
          bid: data.bid,
          ask: data.ask,
        })
      }
    }

    if (prices.length < 2) return

    prices.sort((a, b) => a.ask - b.ask)
    const bestBuy = prices[0]

    prices.sort((a, b) => b.bid - a.bid)
    const bestSell = prices[0]

    const spread = ((bestSell.bid - bestBuy.ask) / bestBuy.ask) * 100
    const minSpread = 0.15

    if (spread > minSpread && bestBuy.exchange !== bestSell.exchange) {
      const opportunity: ArbitrageOpportunity = {
        symbol: symbol,
        buyExchange: bestBuy.exchange,
        sellExchange: bestSell.exchange,
        buyPrice: bestBuy.ask,
        sellPrice: bestSell.bid,
        spread: spread,
        volume: Math.min(1000, 10000),
        timestamp: Date.now(),
      }

      this.opportunities.unshift(opportunity)

      if (this.opportunities.length > 100) {
        this.opportunities = this.opportunities.slice(0, 100)
      }

      console.log(
        `🔍 Arbitrage Opportunity: ${symbol} - Buy ${bestBuy.exchange} $${bestBuy.ask.toFixed(2)} → Sell ${bestSell.exchange} $${bestSell.bid.toFixed(2)} (${spread.toFixed(3)}%)`,
      )

      this.listeners.forEach((listener) => listener(opportunity))
    }
  }

  private startArbitrageMonitoring() {
    console.log("👁️ Starting arbitrage monitoring...")

    setInterval(() => {
      const dataCount = this.marketData.size
      const recentOpportunities = this.opportunities.filter((op) => Date.now() - op.timestamp < 60000).length

      console.log(`📊 Market Data: ${dataCount} streams | Recent Opportunities: ${recentOpportunities}`)
    }, 10000)
  }

  onArbitrageOpportunity(callback: (opportunity: ArbitrageOpportunity) => void) {
    this.listeners.push(callback)
  }

  getRecentOpportunities(limit = 20): ArbitrageOpportunity[] {
    return this.opportunities.slice(0, limit)
  }

  getMarketData(): Map<string, MarketData> {
    return this.marketData
  }

  isConnectedToExchanges(): boolean {
    return this.isConnected
  }

  disconnect() {
    console.log("🔌 Disconnecting market simulation...")

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }

    this.isConnected = false
  }
}

export const webSocketMarketService = new WebSocketMarketService()
