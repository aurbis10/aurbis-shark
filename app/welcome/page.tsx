export default function WelcomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Welcome to Aurbis Trading Bot!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your cryptocurrency arbitrage trading bot is successfully deployed on Vercel and ready for 24/7 demo trading.
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Start Guide</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verify Deployment</h3>
                <p className="text-gray-600 text-sm">
                  Run comprehensive checks to ensure everything is working correctly.
                </p>
                <a href="/deployment-success" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  → Run Verification
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Start Demo Trading</h3>
                <p className="text-gray-600 text-sm">Begin 24/7 arbitrage simulation with real market data.</p>
                <a href="/continuous-demo" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  → Start Trading
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Monitor Performance</h3>
                <p className="text-gray-600 text-sm">Track system health and trading performance in real-time.</p>
                <a href="/status" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  → View Status
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configure Settings</h3>
                <p className="text-gray-600 text-sm">Set up your exchange API credentials for live trading.</p>
                <a href="/setup" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  → Configure APIs
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Run Diagnostics</h3>
                <p className="text-gray-600 text-sm">Troubleshoot issues and optimize performance.</p>
                <a href="/diagnostics" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  → Run Diagnostics
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Dashboard</h3>
                <p className="text-gray-600 text-sm">Access the main trading dashboard and controls.</p>
                <a href="/" className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  → Open Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Key Features</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🤖
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automated Trading</h3>
            <p className="text-gray-600 text-sm">24/7 arbitrage detection and execution across multiple exchanges</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📊
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600 text-sm">Live performance tracking and system health monitoring</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔒
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Safe Demo Mode</h3>
            <p className="text-gray-600 text-sm">Test strategies with demo accounts before live trading</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 System Status</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">✅</div>
            <div className="text-sm text-gray-600 mt-1">Deployment</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">🚀</div>
            <div className="text-sm text-gray-600 mt-1">APIs Ready</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">📡</div>
            <div className="text-sm text-gray-600 mt-1">Monitoring</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">⚡</div>
            <div className="text-sm text-gray-600 mt-1">Performance</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Trading? 🚀</h2>
        <p className="mb-6 text-blue-100">Your Aurbis Trading Bot is fully deployed and ready for action!</p>
        <div className="flex gap-4 justify-center">
          <a
            href="/deployment-success"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Verify Deployment
          </a>
          <a
            href="/continuous-demo"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Start Demo Trading
          </a>
        </div>
      </div>
    </div>
  )
}
