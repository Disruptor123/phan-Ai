"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/lib/sei-wallet"
import { Trophy, Zap, Shield, Users, Star, Lock } from "lucide-react"

export function PhanTokenInfo() {
  const { phantomBalance, spendPhanTokens } = useWallet()

  const currentBalance = Number.parseFloat(phantomBalance)
  const phantomPrice = 0.12
  const usdValue = (currentBalance * phantomPrice).toFixed(2)

  const earningMethods = [
    { action: "Create Blockchain", reward: 100, icon: "🔗" },
    { action: "Deploy Blockchain", reward: 75, icon: "🚀" },
    { action: "Create Token", reward: 50, icon: "🪙" },
    { action: "Distribute Tokens", reward: 25, icon: "📤" },
    { action: "Complete Stress Test", reward: 150, icon: "⚡" },
  ]

  const utilities = [
    {
      name: "Premium Analytics",
      cost: 500,
      icon: <Trophy className="h-4 w-4" />,
      description: "Advanced charts and insights",
    },
    {
      name: "Advanced Security Tests",
      cost: 300,
      icon: <Shield className="h-4 w-4" />,
      description: "Comprehensive security audits",
    },
    {
      name: "Custom Network Topologies",
      cost: 200,
      icon: <Zap className="h-4 w-4" />,
      description: "Build custom network structures",
    },
    {
      name: "Priority Support",
      cost: 1000,
      icon: <Star className="h-4 w-4" />,
      description: "24/7 dedicated support channel",
    },
  ]

  const handleUnlock = (cost: number, name: string) => {
    if (spendPhanTokens(cost)) {
      alert(`${name} unlocked! You now have access to this premium feature.`)
    } else {
      alert(`Insufficient PHAN tokens. You need ${cost} PHAN but only have ${currentBalance}.`)
    }
  }

  const getRank = () => {
    if (currentBalance >= 1000) return { rank: "Phantom Master", color: "bg-purple-500", icon: "👑" }
    if (currentBalance >= 500) return { rank: "Ghost Hunter", color: "bg-blue-500", icon: "🎯" }
    if (currentBalance >= 200) return { rank: "Spirit Walker", color: "bg-green-500", icon: "🌟" }
    if (currentBalance >= 50) return { rank: "Phantom Novice", color: "bg-yellow-500", icon: "⭐" }
    return { rank: "New Ghost", color: "bg-gray-500", icon: "👻" }
  }

  const userRank = getRank()

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">👻</span>
          <span>PHAN Token Hub</span>
          <Badge className={`${userRank.color} text-white ml-auto`}>
            {userRank.icon} {userRank.rank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="text-center p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Your PHAN Balance</p>
          <p className="text-3xl font-bold text-purple-600">{phantomBalance} PHAN</p>
          <p className="text-sm text-gray-500">${usdValue} USD</p>
        </div>

        {/* Earning Methods */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            Earn PHAN Tokens
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {earningMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-sm font-medium">{method.action}</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +{method.reward} PHAN
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            Spend PHAN Tokens
          </h4>
          <div className="space-y-3">
            {utilities.map((utility, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {utility.icon}
                  <div>
                    <p className="text-sm font-medium">{utility.name}</p>
                    <p className="text-xs text-gray-600">{utility.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    {utility.cost} PHAN
                  </Badge>
                  {currentBalance >= utility.cost ? (
                    <Button
                      size="sm"
                      onClick={() => handleUnlock(utility.cost, utility.name)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Unlock
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="text-gray-400 bg-transparent">
                      <Lock className="h-3 w-3 mr-1" />
                      Need More
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Hint */}
        <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <p className="text-xs text-gray-600">
            🏆 Collect more PHAN tokens to climb the leaderboard and unlock exclusive features!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
