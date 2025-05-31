"use client"

import { useState } from "react"

export default function TradingPage() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT")
  const [amount, setAmount] = useState("100")
  const [autoTrade, setAutoTrade] = useState(false)

  const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT"]
  const exchanges = ["Binance", "Bybit", "OKX"]

  const executeTrade = () => {
    alert(`Executing arbitrage trade for ${selectedPair} with $${amount}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trading Configuration</h1>
        <p className="mt-2 text-gray-600">Configure your arbitrage trading parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trading Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Trading Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {pairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trade Amount (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoTrade"
                checked={autoTrade}
                onChange={(e) => setAutoTrade(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoTrade" className="text-sm text-gray-700">
                Enable Auto Trading
              </label>
            </div>

            <button
              onClick={executeTrade}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Execute Manual Trade
            </button>
          </div>
        </div>

        {/* Exchange Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Exchange Status</h2>

          <div className="space-y-4">
            {exchanges.map((exchange) => (
              <div key={exchange} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">{exchange}</div>
                  <div className="text-sm text-gray-500">API Connected</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Opportunities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Current Arbitrage Opportunities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pair</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buy Exchange</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sell Exchange</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spread</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potential Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BTC/USDT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Binance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bybit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">0.23%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$23.45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Execute
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ETH/USDT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">OKX</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Binance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">0.18%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$18.90</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Execute
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
