"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Copy, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/sei-wallet"
import { useState } from "react"

export function WalletBalance() {
  const { isConnected, address, balance, usdBalance, assets, connectWallet, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const totalUsdValue = assets.reduce((total, asset) => total + Number.parseFloat(asset.usdValue), 0).toFixed(2)

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">Connect your SEI wallet to start building and managing blockchains</p>
          <Button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              Disconnect
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalUsdValue}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+0.00% (24h)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
              <div className="text-xs text-gray-500">Address:</div>
              <div className="text-xs font-mono text-gray-700 flex-1 truncate">{address}</div>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
                {copied ? <span className="text-xs text-green-600">✓</span> : <Copy className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => window.open(`https://sei.explorers.guru/account/${address}`, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{asset.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{asset.symbol}</p>
                    <p className="text-sm text-gray-600">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{asset.balance}</p>
                  <p className="text-sm text-gray-600">${asset.usdValue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
