export default function PerformancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="mt-2 text-gray-600">Trading metrics and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Profit</h3>
          <div className="mt-2 text-2xl font-bold text-green-600">$1,234.56</div>
          <p className="text-sm text-gray-500">Demo USDT</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Win Rate</h3>
          <div className="mt-2 text-2xl font-bold text-blue-600">78.5%</div>
          <p className="text-sm text-gray-500">Success rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Trades</h3>
          <div className="mt-2 text-2xl font-bold text-purple-600">1,456</div>
          <p className="text-sm text-gray-500">Executed trades</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Chart</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  )
}
