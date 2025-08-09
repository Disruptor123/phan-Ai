"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSeiWallet } from "@/lib/sei-wallet"
import { Coins, Star, Lock, Unlock, Trophy, Zap } from "lucide-react"

export function PhanTokenInfo() {
  const { assets } = useSeiWallet()

  // Get PHAN token balance
  const phantomAsset = assets.find((asset) => asset.symbol === "PHAN")
  const phantomBalance = Number.parseFloat(phantomAsset?.balance || "0")
  const phantomPrice = 0.12 // Mock PHAN price in USD
  const phantomUsdValue = (phantomBalance * phantomPrice).toFixed(2)

  // Define earning opportunities
  const earningMethods = [
    { action: "Create Blockchain", reward: 100, icon: "🔗" },
    { action: "Deploy Smart Contract", reward: 75, icon: "📜" },
    { action: "Create Token", reward: 50, icon: "🪙" },
    { action: "Distribute Tokens", reward: 25, icon: "📤" },
    { action: "Complete Test Suite", reward: 150, icon: "🧪" },
  ]

  // Define utilities and their costs
  const utilities = [
    { name: "Premium Analytics", cost: 500, available: phantomBalance >= 500, icon: "📊" },
    { name: "Advanced Security Tests", cost: 300, available: phantomBalance >= 300, icon: "🛡️" },
    { name: "Custom Network Topologies", cost: 200, available: phantomBalance >= 200, icon: "🌐" },
    { name: "Priority Support", cost: 1000, available: phantomBalance >= 1000, icon: "⚡" },
  ]

  // Calculate user rank based on balance
  const getRank = (balance: number) => {
    if (balance >= 1000) return { name: "Phantom Master", icon: "👑", color: "text-yellow-600" }
    if (balance >= 500) return { name: "Blockchain Expert", icon: "🏆", color: "text-purple-600" }
    if (balance >= 250) return { name: "Token Creator", icon: "⭐", color: "text-blue-600" }
    if (balance >= 100) return { name: "Network Builder", icon: "🔧", color: "text-green-600" }
    return { name: "Phantom Novice", icon: "🌱", color: "text-gray-600" }
  }

  const userRank = getRank(phantomBalance)

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">👻</span>
          <span>PHAN Tokens</span>
          <Badge variant="outline" className={`${userRank.color} border-current`}>
            {userRank.icon} {userRank.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="text-center p-4 bg-white/50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{phantomBalance.toFixed(0)} PHAN</div>
          <div className="text-sm text-gray-600">≈ ${phantomUsdValue} USD</div>
        </div>

        {/* Earning Methods */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            Earn PHAN Tokens
          </h4>
          <div className="space-y-2">
            {earningMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/30 rounded">
                <div className="flex items-center space-x-2">
                  <span>{method.icon}</span>
                  <span className="text-sm text-gray-700">{method.action}</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +{method.reward} PHAN
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Token Utilities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Spend PHAN Tokens
          </h4>
          <div className="space-y-2">
            {utilities.map((utility, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/30 rounded">
                <div className="flex items-center space-x-2">
                  <span>{utility.icon}</span>
                  <span className="text-sm text-gray-700">{utility.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">{utility.cost} PHAN</span>
                  {utility.available ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlock
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="h-6 px-2 text-xs bg-transparent">
                      <Lock className="h-3 w-3 mr-1" />
                      Need More
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress to Next Rank */}
        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to Next Rank</span>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="w-full bg-white/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((phantomBalance % 250) / 250) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {phantomBalance >= 1000 ? "Max rank achieved!" : `${250 - (phantomBalance % 250)} PHAN to next rank`}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Pro Tip</p>
              <p className="text-xs text-blue-700">
                Complete the full test suite to earn a 150 PHAN bonus and unlock premium features faster!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
