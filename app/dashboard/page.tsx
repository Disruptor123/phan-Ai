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
import { WelcomeState } from "@/components/welcome-state"
import { useSeiWallet } from "@/lib/sei-wallet"
import { Wallet, Activity, Zap, Shield, BarChart3, Settings, Star, Target, LogOut, Copy, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const { account, chainId, isConnected, disconnect, updatePhanBalance } = useSeiWallet()
  const [showSendReceive, setShowSendReceive] = useState(false)
  const [showSignature, setShowSignature] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Check if user has performed any operations
  useEffect(() => {
    const hasActivity = localStorage.getItem("phan_signatures") || localStorage.getItem("phan_user_activity")
    setIsFirstTime(!hasActivity && isConnected)
  }, [isConnected])

  // Check wallet connection on mount
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  // Handle getting started
  const handleGetStarted = () => {
    setIsFirstTime(false)
    localStorage.setItem("phan_user_activity", "true")
    setActiveTab("basic")
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      disconnect()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Copy wallet address
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      alert("Address copied to clipboard!")
    }
  }

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
        updatePhanBalance((prev) => (Number.parseFloat(prev) + op.reward).toString())
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
    updatePhanBalance((prev) => (Number.parseFloat(prev) + 150).toString())
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-gray-400 mb-6">Please connect your Sei wallet to access the dashboard</p>
          <Button onClick={() => router.push("/")} className="bg-white text-black hover:bg-gray-100">
            Go Back to Landing Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">PHAN AI Dashboard</h1>
            <p className="text-white">Phantom Blockchain Development Environment</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Compact Wallet Info */}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2">
              <Wallet className="w-4 h-4 text-red-400" />
              <div className="text-sm">
                <p className="text-white font-mono">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not Connected"}
                </p>
                <p className="text-gray-400 text-xs">Chain ID: {chainId}</p>
              </div>
              <Button
                onClick={copyAddress}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-gray-400 hover:text-white"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="w-4 h-4 mr-2" />
              System Online
            </Badge>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Wallet Balance - Takes up 1 column */}
          <div className="col-span-1">
            <WalletBalance />
          </div>

          {/* Main Content Area - Takes up 3 columns */}
          <div className="col-span-3">
            {isFirstTime ? (
              <WelcomeState onGetStarted={handleGetStarted} />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-800">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Operations
                  </TabsTrigger>
                  <TabsTrigger
                    value="signatures"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Signatures
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="tokens"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    PHAN Tokens
                  </TabsTrigger>
                </TabsList>

                {/* Operations Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <Card className="bg-black border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white">Test Operations</CardTitle>
                      <Button
                        onClick={runComprehensiveTest}
                        disabled={isRunningTests}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        {isRunningTests ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Running Tests...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Run Comprehensive Test
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testResults.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                            <p>No operations yet. Run your first test to get started!</p>
                          </div>
                        ) : (
                          testResults
                            .slice(-5)
                            .reverse()
                            .map((result) => (
                              <div
                                key={result.id}
                                className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg"
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
                                    <p className="font-medium text-white">{result.type}</p>
                                    <p className="text-sm text-gray-400">{result.details}</p>
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

                {/* Signatures Tab */}
                <TabsContent value="signatures">
                  <SignatureVerification signatures={signatures} />
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <Card key={index} className="bg-black border-gray-800">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                              <p className="text-2xl font-bold text-white">{stat.value}</p>
                              <p
                                className={`text-sm ${
                                  stat.change.startsWith("+")
                                    ? "text-green-400"
                                    : stat.change.startsWith("-")
                                      ? "text-red-400"
                                      : "text-gray-500"
                                }`}
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
                </TabsContent>

                {/* PHAN Tokens Tab */}
                <TabsContent value="tokens">
                  <PhanTokenInfo />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendReceiveModal isOpen={showSendReceive} onClose={() => setShowSendReceive(false)} />
      <TransactionSignatureModal isOpen={showSignature} onClose={() => setShowSignature(false)} />
    </div>
  )
}
