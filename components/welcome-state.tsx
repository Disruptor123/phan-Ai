"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Shield, Coins, BarChart3, ArrowRight, Sparkles } from "lucide-react"

interface WelcomeStateProps {
  onGetStarted: () => void
}

export function WelcomeState({ onGetStarted }: WelcomeStateProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700/50">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to PhanAI!</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            You're about to enter the future of blockchain security testing. Create phantom blockchains, deploy tokens,
            and stress-test your ideas without risking real assets.
          </p>
          <Button onClick={onGetStarted} size="lg" className="bg-white text-black hover:bg-gray-100">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Phantom Blockchains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-sm">
              Create secure, isolated blockchain environments that mirror real networks for safe testing and
              development.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Multiple consensus algorithms
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Configurable network topology
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Real-time monitoring
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Coins className="w-5 h-5 mr-2 text-purple-400" />
              Token Deployment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-sm">
              Deploy and test custom tokens with advanced features like staking, governance, and automated distribution.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Custom tokenomics
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Automated distribution
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Governance features
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-green-400" />
              Stress Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-sm">
              Run comprehensive security tests and attack simulations to identify vulnerabilities before going live.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                DDoS attack simulation
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Smart contract exploits
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Network partition testing
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-400" />
              Analytics & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-sm">
              Get detailed performance metrics, security reports, and optimization recommendations for your blockchain.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                Performance monitoring
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                Security analysis
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                Optimization tips
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-2">Create Blockchain</h4>
              <p className="text-gray-400 text-sm">Set up your phantom blockchain with custom parameters</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-2">Deploy & Configure</h4>
              <p className="text-gray-400 text-sm">Deploy your blockchain and configure network settings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-2">Create Tokens</h4>
              <p className="text-gray-400 text-sm">Deploy custom tokens with advanced features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="text-white font-medium mb-2">Test & Analyze</h4>
              <p className="text-gray-400 text-sm">Run stress tests and analyze performance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-900/20 border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium mb-1">Secure Testing Environment</h4>
              <p className="text-blue-200 text-sm">
                All operations are performed in isolated phantom environments. Your real assets are never at risk, and
                all testing is completely safe and reversible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
