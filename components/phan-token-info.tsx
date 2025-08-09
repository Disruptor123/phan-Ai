"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Gift, Zap, Trophy, Info } from "lucide-react"
import { useSeiWallet } from "@/lib/sei-wallet"

export function PhanTokenInfo() {
  const { assets } = useSeiWallet()

  const phanAsset = assets.find((asset) => asset.symbol === "PHAN")
  const phanBalance = phanAsset ? Number.parseFloat(phanAsset.balance.replace(",", "")) : 0

  const rewards = [
    { action: "Create Phantom Blockchain", reward: 100, icon: "🏗️" },
    { action: "Deploy Blockchain", reward: 75, icon: "🚀" },
    { action: "Create Token", reward: 50, icon: "🪙" },
    { action: "Distribute Tokens", reward: 25, icon: "📤" },
    { action: "Complete Stress Test", reward: 150, icon: "🛡️" },
  ]

  const utilities = [
    { feature: "Premium Analytics", cost: 500, icon: "📊" },
    { feature: "Advanced Security Tests", cost: 300, icon: "🔒" },
    { feature: "Custom Network Topologies", cost: 200, icon: "🌐" },
    { feature: "Priority Support", cost: 1000, icon: "⭐" },
  ]

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Coins className="w-5 h-5 mr-2 text-purple-400" />
          PHAN Token System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Your PHAN Balance</span>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              👻 PHAN
            </Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{phanBalance.toLocaleString()} PHAN</div>
          <div className="text-sm text-purple-300">≈ ${(phanBalance * 0.001).toFixed(2)} USD</div>
        </div>

        {/* Earn Rewards */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center">
            <Gift className="w-4 h-4 mr-2 text-green-400" />
            Earn PHAN Tokens
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{reward.icon}</span>
                  <span className="text-white text-sm">{reward.action}</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  +{reward.reward} PHAN
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Token Utilities */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center">
            <Zap className="w-4 h-4 mr-2 text-blue-400" />
            Spend PHAN Tokens
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {utilities.map((utility, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{utility.icon}</span>
                  <span className="text-white text-sm">{utility.feature}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                    {utility.cost} PHAN
                  </Badge>
                  <Button
                    size="sm"
                    disabled={phanBalance < utility.cost}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 h-auto"
                  >
                    {phanBalance >= utility.cost ? "Unlock" : "Need More"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Info */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium mb-1">About PHAN Tokens</h4>
              <p className="text-blue-200 text-sm">
                PHAN tokens are earned by actively using the PhanAI platform. Use them to unlock premium features,
                access advanced testing tools, and get priority support. The more you build and test, the more you earn!
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Teaser */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <h4 className="text-yellow-300 font-medium">Top Builder</h4>
                <p className="text-yellow-200 text-sm">
                  Rank #{Math.max(1, Math.floor(phanBalance / 100) + 1)} this month
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-yellow-700 text-yellow-400 bg-transparent">
              View Leaderboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
