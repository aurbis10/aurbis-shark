import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aurbis Trading Bot - Professional Arbitrage System",
  description: "Advanced cryptocurrency arbitrage trading bot with professional risk management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900">
          {/* Navigation */}
          <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-14">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>🤖</span>
                    <span>Aurbis Trading Bot</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/paper-trading"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Paper Trading
                  </Link>
                  <Link
                    href="/real-money-trading"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Real Money
                  </Link>
                  <Link
                    href="/setup"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Setup
                  </Link>
                  <Link
                    href="/diagnostics"
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Diagnostics
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-4 px-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
