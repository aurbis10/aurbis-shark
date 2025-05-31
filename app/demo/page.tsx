"use client"

import { useState } from "react"

export default function DemoPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [trades, setTrades] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalTrades: 0,
    profit: 0,
    winRate: 0,
  })

  const startTrading = () => {
    setIsRunning(true)
    // Simulate trades
    const interval = setInterval(() => {
      const newTrade = {
        id: Date.now(),
        pair: ["BTC/USDT", "ETH/USDT", "SOL/USDT"][Math.floor(Math.random() * 3)],
        buyExchange: ["Binance", "Bybit", "OKX"][Math.floor(Math.random() * 3)],
        sellExchange: ["Binance", "Bybit", "OKX"][Math.floor(Math.random() * 3)],
        profit: (Math.random() - 0.3) * 100,
        timestamp: new Date().toISOString(),
      }
      setTrades((prev) => [newTrade, ...prev.slice(0, 9)])
      setStats((prev) => ({
        totalTrades: prev.totalTrades + 1,
        profit: prev.profit + newTrade.profit,
        winRate: Math.random() * 100,
      }))
    }, 3000)

    // Store interval to clear later
    ;(window as any).tradingInterval = interval
  }

  const stopTrading = () => {
    setIsRunning(false)
    if ((window as any).tradingInterval) {
      clearInterval((window as any).tradingInterval)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">24/7 Demo Trading</h1>
        <p className="mt-2 text-gray-600">Continuous arbitrage simulation using testnet accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                isRunning ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {isRunning ? "Running" : "Stopped"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Trades</h3>
          <div className="mt-2 text-2xl font-bold text-blue-600">{stats.totalTrades}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Profit</h3>
          <div className={`mt-2 text-2xl font-bold ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${stats.profit.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trading Control</h3>
          <div className="space-x-2">
            <button
              onClick={startTrading}
              disabled={isRunning}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Start Trading
            </button>
            <button
              onClick={stopTrading}
              disabled={!isRunning}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Stop Trading
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
        <div className="space-y-3">
          {trades.length === 0 ? (
            <p className="text-gray-500">No trades yet. Start trading to see results.</p>
          ) : (
            trades.map((trade) => (
              <div key={trade.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <span className="font-medium">{trade.pair}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {trade.buyExchange} → {trade.sellExchange}
                  </span>
                </div>
                <div className={`font-bold ${trade.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${trade.profit.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
