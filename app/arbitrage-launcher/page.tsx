"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ArbitrageLauncherPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🚀 Professional Arbitrage Launcher</h1>
        <p className="text-muted-foreground">Launch professional arbitrage trading with realistic market parameters</p>
      </div>

      {/* Quick Launch */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">⚡ Ready to Start Professional Arbitrage</CardTitle>
          <CardDescription>
            Launch high-frequency arbitrage trading with realistic spreads and ROI targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Realistic Parameters</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Spreads: 0.15% - 0.8% (realistic range)</li>
                  <li>• ROI: 0.1% - 0.5% per trade</li>
                  <li>• Execution: 50-200ms latency</li>
                  <li>• Win rate: 85%+ target</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700">Professional Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High-frequency execution</li>
                  <li>• Volume-based profits</li>
                  <li>• Tight risk management</li>
                  <li>• Real-time monitoring</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href="/start-arbitrage">🚀 Launch Professional Arbitrage</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/continuous-demo">📊 View Current Status</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Market Scanning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Continuous monitoring of BTC, ETH, SOL, ADA, and DOT across Binance, Bybit, and OKX for arbitrage
              opportunities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚡ High-Frequency Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              3-second scanning intervals with 50-200ms execution speed for professional arbitrage trading.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🛡️ Risk Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tight 1% stop loss, 5% max exposure per trade, and 200 daily trade limit with drawdown protection.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expected Performance */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Expected Performance (Realistic Arbitrage)</CardTitle>
          <CardDescription>Based on professional arbitrage trading parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0.1-0.5%</div>
              <div className="text-sm text-muted-foreground">ROI per trade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%+</div>
              <div className="text-sm text-muted-foreground">Win rate target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100-200</div>
              <div className="text-sm text-muted-foreground">Trades per day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1-5%</div>
              <div className="text-sm text-muted-foreground">Daily growth target</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 Quick Access</CardTitle>
          <CardDescription>Navigate to key system components</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          <Button variant="outline" asChild>
            <a href="/">🏠 Dashboard</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/status">📈 System Status</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/setup">⚙️ Configuration</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/diagnostics">🔧 Diagnostics</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
