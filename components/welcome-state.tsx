"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Star, Shield, Network, Award, Zap } from "lucide-react"

interface WelcomeStateProps {
  onGetStarted: () => void
}

export function WelcomeState({ onGetStarted }: WelcomeStateProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Rocket className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl text-gray-900">Welcome to PhanAI!</CardTitle>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your blockchain development and testing platform is ready. Start by exploring the features and earning PHAN
            tokens.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <Star className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <Network className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Blockchain Testing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Comprehensive testing suite for blockchain operations and smart contracts
          </p>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Earn 100+ PHAN
          </Badge>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Token Rewards</h3>
          <p className="text-sm text-gray-600 mb-4">
            Earn PHAN tokens for every successful operation and unlock premium features
          </p>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Up to 1000 PHAN
          </Badge>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Security Audits</h3>
          <p className="text-sm text-gray-600 mb-4">
            Advanced security testing and signature verification for your blockchain projects
          </p>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Premium Feature
          </Badge>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Connect Your Wallet</h4>
                <p className="text-sm text-gray-600">Link your SEI wallet to start earning rewards</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Run Test Operations</h4>
                <p className="text-sm text-gray-600">Execute blockchain tests to earn PHAN tokens</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Unlock Premium Features</h4>
                <p className="text-sm text-gray-600">Use tokens to access advanced tools</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Build & Deploy</h4>
                <p className="text-sm text-gray-600">Create your own blockchain solutions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
