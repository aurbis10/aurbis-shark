"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DeploymentCheckPage() {
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "error">("loading")
  const [apiData, setApiData] = useState<any>(null)

  const testAPI = async () => {
    setApiStatus("loading")
    try {
      const response = await fetch("/api/deployment-test")
      const data = await response.json()
      setApiData(data)
      setApiStatus("success")
    } catch (error) {
      setApiStatus("error")
    }
  }

  useEffect(() => {
    testAPI()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Deployment Check</h1>
        <p className="text-muted-foreground">Verify that the application is deployed correctly</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Test</CardTitle>
          <CardDescription>Test basic API functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>API Status:</span>
            <Badge variant={apiStatus === "success" ? "default" : apiStatus === "error" ? "destructive" : "secondary"}>
              {apiStatus === "loading" ? "Testing..." : apiStatus === "success" ? "Working" : "Error"}
            </Badge>
          </div>

          {apiData && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Message:</span>
                <span>{apiData.message}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{new Date(apiData.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span>{apiData.version}</span>
              </div>
            </div>
          )}

          <Button onClick={testAPI} className="w-full">
            Test API Again
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Test</CardTitle>
          <CardDescription>Test all main pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/" className="block">
            <Button variant="outline" className="w-full">
              Home Page
            </Button>
          </a>
          <a href="/continuous-demo" className="block">
            <Button variant="outline" className="w-full">
              Demo Trading
            </Button>
          </a>
          <a href="/performance" className="block">
            <Button variant="outline" className="w-full">
              Performance
            </Button>
          </a>
          <a href="/diagnostics" className="block">
            <Button variant="outline" className="w-full">
              Diagnostics
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
