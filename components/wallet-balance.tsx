"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, RefreshCw, TrendingUp, Eye, EyeOff, Copy, ExternalLink } from "lucide-react"
import { useSeiWallet } from "@/lib/sei-wallet"
import { SendReceiveModal } from "./send-receive-modal"

export function WalletBalance() {
  const { account, chainId, balance, isLoadingBalance, assets, refreshBalance } = useSeiWallet()

  const [showBalance, setShowBalance] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalance()
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      alert("Address copied to clipboard!")
    }
  }

  const formatBalance = (balance: string) => {
    if (!showBalance) return "••••••"
    return balance
  }

  const getTotalValue = () => {
    if (!showBalance) return "••••••"

    // Calculate real total based on actual balances
    const seiBalance = Number.parseFloat(balance || "0")
    const seiPrice = 0.45 // Current SEI price (this could be fetched from an API)

    const total = seiBalance * seiPrice
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center text-lg">
            <Wallet className="w-5 h-5 mr-2 text-red-400" />
            Wallet Balance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowBalance(!showBalance)}
              size="sm"
              variant="ghost"
              className="p-2 h-auto text-gray-400 hover:text-white"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingBalance}
              size="sm"
              variant="ghost"
              className="p-2 h-auto text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Account Info */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Connected Account</span>
            <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
              Connected
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono text-sm">
              {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "Not Connected"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={copyAddress}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-gray-400 hover:text-white"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="p-1 h-auto text-gray-400 hover:text-white">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Chain ID: {chainId}</div>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Total Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoadingBalance ? <div className="animate-pulse bg-gray-700 h-8 w-32 rounded"></div> : getTotalValue()}
          </div>
          <div className="text-xs text-green-400 mt-1">+2.34% (24h)</div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Asset List */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm">Assets</h4>

          {isLoadingBalance ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-700 rounded w-12"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {assets.map((asset, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      {asset.logo}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{asset.symbol}</div>
                      <div className="text-gray-400 text-xs">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">
                      {formatBalance(asset.balance)} {asset.symbol}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {asset.symbol === "SEI" &&
                        showBalance &&
                        `≈ $${(Number.parseFloat(asset.balance) * 0.45).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button onClick={() => setShowSendModal(true)} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            Send
          </Button>
          <Button
            onClick={() => setShowReceiveModal(true)}
            size="sm"
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
          >
            Receive
          </Button>
        </div>

        {/* Send/Receive Modals */}
        <SendReceiveModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} mode="send" />
        <SendReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} mode="receive" />
      </CardContent>
    </Card>
  )
}
