"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSeiWallet } from "@/lib/sei-wallet"
import { Wallet, TrendingUp, RefreshCw, Send, Download } from "lucide-react"
import { useState } from "react"

export function WalletBalance() {
  const { account, balance, assets, isLoadingBalance, isConnected, connect, refreshBalance } = useSeiWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Calculate total portfolio value in USD
  const seiPrice = 0.45 // Mock SEI price
  const phantomPrice = 0.12 // Mock PHAN price

  const totalUsdValue = assets.reduce((total, asset) => {
    const price = asset.symbol === "SEI" ? seiPrice : phantomPrice
    return total + Number.parseFloat(asset.balance) * price
  }, 0)

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-gray-900">Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">Connect your SEI wallet to get started</p>
          <Button onClick={connect} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Connect SEI Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">Portfolio Balance</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Connected
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Value */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">${totalUsdValue.toFixed(2)}</div>
            <div className="flex items-center justify-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.4% today
            </div>
          </div>

          {/* Wallet Address */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
            <p className="font-mono text-sm text-gray-700 bg-white/50 px-2 py-1 rounded">
              {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "Not connected"}
            </p>
          </div>

          {/* Assets List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Assets</h4>
            {isLoadingBalance ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
              </div>
            ) : (
              assets.map((asset) => {
                const price = asset.symbol === "SEI" ? seiPrice : phantomPrice
                const usdValue = (Number.parseFloat(asset.balance) * price).toFixed(2)

                return (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{asset.logo}</div>
                      <div>
                        <p className="font-medium text-gray-900">{asset.symbol}</p>
                        <p className="text-xs text-gray-500">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{asset.balance}</p>
                      <p className="text-xs text-gray-500">${usdValue}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button variant="outline" size="sm" className="bg-white/50">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50">
              <Download className="h-4 w-4 mr-2" />
              Receive
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
