"use client"

import { useState } from "react"

export default function SetupPage() {
  const [apiKeys, setApiKeys] = useState({
    binance: { key: "", secret: "" },
    bybit: { key: "", secret: "" },
    okx: { key: "", secret: "", passphrase: "" },
  })

  const [testResults, setTestResults] = useState<any>({})

  const testConnection = async (exchange: string) => {
    setTestResults((prev) => ({ ...prev, [exchange]: "testing" }))

    // Simulate API test
    setTimeout(() => {
      setTestResults((prev) => ({
        ...prev,
        [exchange]: Math.random() > 0.3 ? "success" : "error",
      }))
    }, 2000)
  }

  const saveSettings = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setup & Configuration</h1>
        <p className="mt-2 text-gray-600">Configure your exchange API credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Binance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Binance</h2>
            <div
              className={`w-3 h-3 rounded-full ${
                testResults.binance === "success"
                  ? "bg-green-500"
                  : testResults.binance === "error"
                    ? "bg-red-500"
                    : "bg-gray-300"
              }`}
            ></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={apiKeys.binance.key}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    binance: { ...prev.binance, key: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Binance API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <input
                type="password"
                value={apiKeys.binance.secret}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    binance: { ...prev.binance, secret: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Secret Key"
              />
            </div>

            <button
              onClick={() => testConnection("binance")}
              disabled={testResults.binance === "testing"}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              {testResults.binance === "testing" ? "Testing..." : "Test Connection"}
            </button>
          </div>
        </div>

        {/* Bybit */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Bybit</h2>
            <div
              className={`w-3 h-3 rounded-full ${
                testResults.bybit === "success"
                  ? "bg-green-500"
                  : testResults.bybit === "error"
                    ? "bg-red-500"
                    : "bg-gray-300"
              }`}
            ></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={apiKeys.bybit.key}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    bybit: { ...prev.bybit, key: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Bybit API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <input
                type="password"
                value={apiKeys.bybit.secret}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    bybit: { ...prev.bybit, secret: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Secret Key"
              />
            </div>

            <button
              onClick={() => testConnection("bybit")}
              disabled={testResults.bybit === "testing"}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {testResults.bybit === "testing" ? "Testing..." : "Test Connection"}
            </button>
          </div>
        </div>

        {/* OKX */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">OKX</h2>
            <div
              className={`w-3 h-3 rounded-full ${
                testResults.okx === "success"
                  ? "bg-green-500"
                  : testResults.okx === "error"
                    ? "bg-red-500"
                    : "bg-gray-300"
              }`}
            ></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={apiKeys.okx.key}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    okx: { ...prev.okx, key: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter OKX API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <input
                type="password"
                value={apiKeys.okx.secret}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    okx: { ...prev.okx, secret: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Secret Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passphrase</label>
              <input
                type="password"
                value={apiKeys.okx.passphrase}
                onChange={(e) =>
                  setApiKeys((prev) => ({
                    ...prev,
                    okx: { ...prev.okx, passphrase: e.target.value },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Passphrase"
              />
            </div>

            <button
              onClick={() => testConnection("okx")}
              disabled={testResults.okx === "testing"}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {testResults.okx === "testing" ? "Testing..." : "Test Connection"}
            </button>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Save Configuration</h3>
            <p className="text-gray-600">Save your API credentials securely</p>
          </div>
          <button onClick={saveSettings} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
