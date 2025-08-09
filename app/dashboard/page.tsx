"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalance } from "@/components/wallet-balance"
import { SendReceiveModal } from "@/components/send-receive-modal"
import { TransactionSignatureModal } from "@/components/transaction-signature-modal"
import { SignatureVerification } from "@/components/signature-verification"
import { PhanTokenInfo } from "@/components/phan-token-info"
import { useWallet } from "@/lib/sei-wallet"
import {
  Wallet,
  Activity,
  Zap,
  Shield,
  Network,
  Send,
  Download,
  BarChart3,
  Settings,
  Bell,
  Star,
  Rocket,
  Target,
  Award,
} from "lucide-react"

interface TestResult {
  id: string
  type: string
  status: "success" | "failed" | "pending"
  timestamp: string
  duration: number
  details: string
}

interface Signature {
  id: string
  operation: string
  signature: string
  timestamp: string
  status: "verified" | "pending" | "failed"
  txHash?: string
}

export default function Dashboard() {
  const { isConnected, addPhanTokens } = useWallet()
  const [showSendReceive, setShowSendReceive] = useState(false)
  const [showSignature, setShowSignature] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  // Check if user has performed any operations
  useEffect(() => {
    const hasActivity = testResults.length > 0 || signatures.length > 0
    setIsFirstTime(!hasActivity && isConnected)
  }, [testResults, signatures, isConnected])

  const runComprehensiveTest = async () => {
    setIsRunningTests(true)
    const operations = [
      { type: "Blockchain Creation", reward: 100 },
      { type: "Token Creation", reward: 50 },
      { type: "Blockchain Deployment", reward: 75 },
      { type: "Token Distribution", reward: 25 },
    ]

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i]
      const testId = `test-${Date.now()}-${i}`

      // Add pending test
      const pendingTest: TestResult = {
        id: testId,
        type: op.type,
        status: "pending",
        timestamp: new Date().toISOString(),
        duration: 0,
        details: `Running ${op.type.toLowerCase()}...`,
      }
      setTestResults((prev) => [...prev, pendingTest])

      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

      // Update test result
      const completedTest: TestResult = {
        ...pendingTest,
        status: Math.random() > 0.1 ? "success" : "failed",
        duration: Math.floor(1000 + Math.random() * 4000),
        details: Math.random() > 0.1 ? `${op.type} completed successfully` : `${op.type} failed - retry recommended`,
      }

      setTestResults((prev) => prev.map((test) => (test.id === testId ? completedTest : test)))

      // Add PHAN tokens for successful operations
      if (completedTest.status === "success") {
        addPhanTokens(op.reward)
      }

      // Add signature record
      const signature: Signature = {
        id: `sig-${testId}`,
        operation: op.type,
        signature: `0x${Math.random().toString(16).substring(2, 66)}`,
        timestamp: new Date().toISOString(),
        status: completedTest.status === "success" ? "verified" : "failed",
        txHash: completedTest.status === "success" ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
      }
      setSignatures((prev) => [...prev, signature])
    }

    // Bonus for completing full test suite
    addPhanTokens(150)
    setIsRunningTests(false)
  }

  const stats = [
    {
      title: "Total Operations",
      value: testResults.length.toString(),
      change: testResults.length > 0 ? "+100%" : "--",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Success Rate",
      value:
        testResults.length > 0
          ? `${Math.round((testResults.filter((t) => t.status === "success").length / testResults.length) * 100)}%`
          : "--",
      change: testResults.length > 0 ? "+5.2%" : "--",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Avg Response Time",
      value:
        testResults.length > 0
          ? `${Math.round(testResults.reduce((acc, t) => acc + t.duration, 0) / testResults.length)}ms`
          : "--",
      change: testResults.length > 0 ? "-12ms" : "--",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      title: "Security Score",
      value: signatures.filter((s) => s.status === "verified").length > 0 ? "A+" : "--",
      change: signatures.length > 0 ? "Excellent" : "--",
      icon: Shield,
      color: "text-purple-600",
    },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to PhanAI Dashboard</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your SEI wallet to access the full suite of blockchain development and testing tools.
            </p>
            <WalletBalance />
          </div>
        </div>
      </div>
    )
  }

  if (isFirstTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Rocket className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Welcome to PhanAI!</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your blockchain development and testing platform is ready. Start by running your first comprehensive test
              suite to earn PHAN tokens and explore the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Wallet Info */}
            <div className="lg:col-span-1">
              <WalletBalance />
            </div>

            {/* Quick Start Guide */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Quick Start Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Run Test Suite</h4>
                        <p className="text-sm text-gray-600">Execute comprehensive blockchain tests</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Earn PHAN Tokens</h4>
                        <p className="text-sm text-gray-600">Get rewarded for each successful operation</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Unlock Features</h4>
                        <p className="text-sm text-gray-600">Use tokens to access premium tools</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Build & Deploy</h4>
                        <p className="text-sm text-gray-600">Create your own blockchain solutions</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button
                      onClick={runComprehensiveTest}
                      disabled={isRunningTests}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                    >
                      {isRunningTests ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Start Your Journey
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <Network className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain Testing</h3>
              <p className="text-sm text-gray-600">
                Comprehensive testing suite for blockchain operations and smart contracts
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Token Rewards</h3>
              <p className="text-sm text-gray-600">
                Earn PHAN tokens for every successful operation and unlock premium features
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Security Audits</h3>
              <p className="text-sm text-gray-600">
                Advanced security testing and signature verification for your blockchain projects
              </p>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Monitor your blockchain operations and manage your assets</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p
                      className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : stat.change.startsWith("-") ? "text-red-600" : "text-gray-500"}`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="operations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="signatures">Signatures</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="operations" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Test Operations</CardTitle>
                    <Button onClick={runComprehensiveTest} disabled={isRunningTests} size="sm">
                      {isRunningTests ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Run Tests
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testResults.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No operations yet. Run your first test to get started!</p>
                        </div>
                      ) : (
                        testResults
                          .slice(-5)
                          .reverse()
                          .map((result) => (
                            <div
                              key={result.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    result.status === "success"
                                      ? "bg-green-500"
                                      : result.status === "failed"
                                        ? "bg-red-500"
                                        : "bg-yellow-500 animate-pulse"
                                  }`}
                                ></div>
                                <div>
                                  <p className="font-medium text-gray-900">{result.type}</p>
                                  <p className="text-sm text-gray-600">{result.details}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    result.status === "success"
                                      ? "default"
                                      : result.status === "failed"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {result.status}
                                </Badge>
                                {result.duration > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">{result.duration}ms</p>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signatures">
                <SignatureVerification signatures={signatures} />
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {testResults.filter((t) => t.status === "success").length}
                          </p>
                          <p className="text-sm text-gray-600">Successful Operations</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">
                            {testResults.filter((t) => t.status === "failed").length}
                          </p>
                          <p className="text-sm text-gray-600">Failed Operations</p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {signatures.filter((s) => s.status === "verified").length}
                        </p>
                        <p className="text-sm text-gray-600">Verified Signatures</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WalletBalance />
            <PhanTokenInfo />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => setShowSendReceive(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send / Receive
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => setShowSignature(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Sign Transaction
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendReceiveModal isOpen={showSendReceive} onClose={() => setShowSendReceive(false)} />
      <TransactionSignatureModal isOpen={showSignature} onClose={() => setShowSignature(false)} />
    </div>
  )
}
