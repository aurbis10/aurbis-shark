"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { type TradingSettings, defaultTradingSettings } from "@/types/trading-settings"
import { AlertCircle, Save, RotateCcw, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TradingSettingsPanel() {
  const [settings, setSettings] = useState<TradingSettings>({ ...defaultTradingSettings })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/real-money-trading/settings")
        const data = await response.json()

        if (data.success && data.settings) {
          setSettings(data.settings)
        } else {
          setError("Failed to load settings")
        }
      } catch (err) {
        setError("Error connecting to server")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch("/api/real-money-trading/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setError(data.error || "Failed to save settings")
      }
    } catch (err) {
      setError("Error connecting to server")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Reset settings
  const resetSettings = async () => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch("/api/real-money-trading/settings", {
        method: "PUT",
      })

      const data = await response.json()

      if (data.success && data.settings) {
        setSettings(data.settings)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setError(data.error || "Failed to reset settings")
      }
    } catch (err) {
      setError("Error connecting to server")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Handle input changes
  const handleChange = (key: keyof TradingSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Toggle trading pair
  const toggleTradingPair = (pair: string) => {
    setSettings((prev) => {
      const enabledPairs = [...prev.enabledPairs]

      if (enabledPairs.includes(pair)) {
        return {
          ...prev,
          enabledPairs: enabledPairs.filter((p) => p !== pair),
        }
      } else {
        return {
          ...prev,
          enabledPairs: [...enabledPairs, pair],
        }
      }
    })
  }

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-gray-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-gray-400">Loading settings...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <span className="text-green-400 mr-2">⚙️</span> Trading Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-md p-3 flex items-center text-red-400 mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="maxExposurePerTrade" className="text-gray-300">
                Max Exposure Per Trade
              </Label>
              <span className="text-green-400 font-mono">{settings.maxExposurePerTrade}%</span>
            </div>
            <Slider
              id="maxExposurePerTrade"
              min={0.1}
              max={5}
              step={0.1}
              value={[settings.maxExposurePerTrade]}
              onValueChange={(value) => handleChange("maxExposurePerTrade", value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1%</span>
              <span>5%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="minSpreadThreshold" className="text-gray-300">
                Min Spread Threshold
              </Label>
              <span className="text-green-400 font-mono">{settings.minSpreadThreshold}%</span>
            </div>
            <Slider
              id="minSpreadThreshold"
              min={1.3}
              max={5}
              step={0.1}
              value={[settings.minSpreadThreshold]}
              onValueChange={(value) => handleChange("minSpreadThreshold", value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.3%</span>
              <span>5%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="maxSlippage" className="text-gray-300">
                Max Slippage
              </Label>
              <span className="text-green-400 font-mono">{settings.maxSlippage}%</span>
            </div>
            <Slider
              id="maxSlippage"
              min={0.1}
              max={1}
              step={0.05}
              value={[settings.maxSlippage]}
              onValueChange={(value) => handleChange("maxSlippage", value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1%</span>
              <span>1%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="maxDailyTrades" className="text-gray-300">
                Max Daily Trades
              </Label>
              <span className="text-green-400 font-mono">{settings.maxDailyTrades}</span>
            </div>
            <Slider
              id="maxDailyTrades"
              min={10}
              max={100}
              step={5}
              value={[settings.maxDailyTrades]}
              onValueChange={(value) => handleChange("maxDailyTrades", value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="emergencyStopLoss" className="text-gray-300">
                Emergency Stop Loss
              </Label>
              <span className="text-red-400 font-mono">{settings.emergencyStopLoss}%</span>
            </div>
            <Slider
              id="emergencyStopLoss"
              min={5}
              max={20}
              step={1}
              value={[settings.emergencyStopLoss]}
              onValueChange={(value) => handleChange("emergencyStopLoss", value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="autoRebalance" className="text-gray-300">
                Auto Rebalance Wallets
              </Label>
              <div className="text-xs text-gray-500">Automatically rebalance exchange wallets</div>
            </div>
            <Switch
              id="autoRebalance"
              checked={settings.autoRebalance}
              onCheckedChange={(checked) => handleChange("autoRebalance", checked)}
            />
          </div>

          {settings.autoRebalance && (
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="rebalanceThreshold" className="text-gray-300">
                  Rebalance Threshold
                </Label>
                <span className="text-green-400 font-mono">{settings.rebalanceThreshold}%</span>
              </div>
              <Slider
                id="rebalanceThreshold"
                min={5}
                max={25}
                step={1}
                value={[settings.rebalanceThreshold]}
                onValueChange={(value) => handleChange("rebalanceThreshold", value[0])}
                className="my-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5%</span>
                <span>25%</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Label className="text-gray-300 block mb-3">Enabled Trading Pairs</Label>
            <div className="flex flex-wrap gap-2">
              {["BTC/USDT", "ETH/USDT", "SOL/USDT"].map((pair) => (
                <Badge
                  key={pair}
                  variant={settings.enabledPairs.includes(pair) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    settings.enabledPairs.includes(pair)
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : "bg-transparent text-gray-400 border-gray-700"
                  }`}
                  onClick={() => toggleTradingPair(pair)}
                >
                  {pair}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">At least one pair must be enabled</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <Button
          variant="outline"
          onClick={resetSettings}
          disabled={saving}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button
          onClick={saveSettings}
          disabled={saving || settings.enabledPairs.length === 0}
          className={`${saveSuccess ? "bg-green-700 hover:bg-green-800" : "bg-blue-700 hover:bg-blue-800"} text-white`}
        >
          {saving ? (
            <div className="flex items-center">
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : saveSuccess ? (
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Saved
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
