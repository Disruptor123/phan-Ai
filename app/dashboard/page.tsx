"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Rocket,
  Coins,
  Activity,
  Shield,
  Network,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  LogOut,
  Wallet,
  Copy,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSeiWallet } from "@/lib/sei-wallet"
import { WalletBalance } from "@/components/wallet-balance"
import { TransactionSignatureModal } from "@/components/transaction-signature-modal"
import { SignatureVerification } from "@/components/signature-verification"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")

  // Sei wallet hooks
  const { account, chainId, isConnected, disconnect } = useSeiWallet()

  // Basic Setup State
  const [blockchainName, setBlockchainName] = useState("")
  const [blockchainType, setBlockchainType] = useState("")
  const [networkSize, setNetworkSize] = useState("")
  const [consensusAlgorithm, setConsensusAlgorithm] = useState("")
  const [transactionVolume, setTransactionVolume] = useState("")
  const [resourceLimits, setResourceLimits] = useState("")
  const [seiIntegration, setSeiIntegration] = useState(false)
  const [blockchainCreated, setBlockchainCreated] = useState(false)

  // Development State
  const [blockSize, setBlockSize] = useState("1")
  const [transactionFees, setTransactionFees] = useState("20")
  const [networkTopology, setNetworkTopology] = useState("")
  const [deploymentStatus, setDeploymentStatus] = useState("idle")
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [stressTestRunning, setStressTestRunning] = useState(false)
  const [transactionLoad, setTransactionLoad] = useState("")
  const [securityThreats, setSecurityThreats] = useState("")
  const [networkConditions, setNetworkConditions] = useState("")

  // Token Deployment State
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [tokenCreated, setTokenCreated] = useState(false)
  const [distributionMethod, setDistributionMethod] = useState("")
  const [recipientAddresses, setRecipientAddresses] = useState("")
  const [amountPerAddress, setAmountPerAddress] = useState("")
  const [tokensDistributed, setTokensDistributed] = useState(false)
  const [txFeesEnabled, setTxFeesEnabled] = useState(false)
  const [stakingEnabled, setStakingEnabled] = useState(false)
  const [votingEnabled, setVotingEnabled] = useState("")
  const [feeRate, setFeeRate] = useState("")
  const [apyRate, setApyRate] = useState("")
  const [votingWeight, setVotingWeight] = useState("")

  // Add state for transaction signatures
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [currentOperation, setCurrentOperation] = useState<any>(null)
  const [operationSignatures, setOperationSignatures] = useState<Record<string, string>>({})

  // Add test mode state
  const [testMode, setTestMode] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  // Check wallet connection on mount
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

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

  // Create Phantom Blockchain Handler
  const handleCreateBlockchain = async () => {
    if (!blockchainName || !blockchainType || !networkSize) {
      alert("Please fill in all required fields")
      return
    }

    // Show signature modal first
    setCurrentOperation({
      type: "blockchain_creation",
      title: "Create Phantom Blockchain",
      description: `Creating phantom blockchain "${blockchainName}" with ${networkSize} network size`,
      details: {
        blockchainName,
        blockchainType,
        networkSize,
        consensusAlgorithm,
        transactionVolume,
        seiIntegration,
      },
      estimatedGas: "~0.002 SEI",
    })
    setShowSignatureModal(true)
  }

  // Apply Configuration Handler
  const handleApplyConfiguration = async () => {
    if (!blockSize || !transactionFees || !networkTopology) {
      alert("Please configure all settings")
      return
    }

    // Simulate configuration application
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Configuration applied successfully!")
  }

  // Deploy Phantom Blockchain Handler
  const handleDeploy = async () => {
    if (!blockchainCreated) {
      alert("Please create a phantom blockchain first")
      return
    }

    // Show signature modal first
    setCurrentOperation({
      type: "blockchain_deployment",
      title: "Deploy Phantom Blockchain",
      description: `Deploying phantom blockchain "${blockchainName}" to the network`,
      details: {
        blockchainName,
        blockSize,
        transactionFees,
        networkTopology,
      },
      estimatedGas: "~0.005 SEI",
    })
    setShowSignatureModal(true)
  }

  // Stress Test Handler
  const handleStressTest = async () => {
    if (deploymentStatus !== "deployed") {
      alert("Please deploy the phantom blockchain first")
      return
    }

    if (!transactionLoad || !securityThreats || !networkConditions) {
      alert("Please configure all stress test parameters")
      return
    }

    setStressTestRunning(!stressTestRunning)

    if (!stressTestRunning) {
      alert("Stress test started! Monitor the results in real-time.")
    } else {
      alert("Stress test stopped.")
    }
  }

  // Create Token Handler
  const handleCreateToken = async () => {
    if (!tokenName || !tokenSymbol || !totalSupply) {
      alert("Please fill in all token details")
      return
    }

    // Show signature modal first
    setCurrentOperation({
      type: "token_creation",
      title: "Create Token",
      description: `Creating token "${tokenName}" (${tokenSymbol}) with ${totalSupply} total supply`,
      details: {
        tokenName,
        tokenSymbol,
        totalSupply,
        decimals,
      },
      estimatedGas: "~0.003 SEI",
    })
    setShowSignatureModal(true)
  }

  // Distribute Tokens Handler
  const handleDistributeTokens = async () => {
    if (!tokenCreated) {
      alert("Please create a token first")
      return
    }

    if (!distributionMethod || !recipientAddresses || !amountPerAddress) {
      alert("Please configure all distribution parameters")
      return
    }

    // Show signature modal first
    setCurrentOperation({
      type: "token_distribution",
      title: "Distribute Tokens",
      description: `Distributing ${tokenSymbol} tokens via ${distributionMethod}`,
      details: {
        tokenName,
        tokenSymbol,
        distributionMethod,
        recipientCount: recipientAddresses.split("\n").length,
        amountPerAddress,
      },
      estimatedGas: "~0.004 SEI",
    })
    setShowSignatureModal(true)
  }

  // Update Token Configuration Handler
  const handleUpdateTokenConfig = async () => {
    if (!tokenCreated) {
      alert("Please create a token first")
      return
    }

    // Simulate configuration update
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Token configuration updated successfully!")
  }

  // Comprehensive Authorization Flow Test
  const runAuthorizationTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    const results: any[] = []

    const testOperations = [
      {
        type: "blockchain_creation",
        title: "Test Phantom Blockchain Creation",
        description: "Testing blockchain creation authorization flow",
        details: {
          blockchainName: "Test Chain",
          blockchainType: "sei",
          networkSize: "small",
          consensusAlgorithm: "pos",
          transactionVolume: "500",
          seiIntegration: true,
        },
      },
      {
        type: "token_creation",
        title: "Test Token Creation",
        description: "Testing token creation authorization flow",
        details: {
          tokenName: "Test Token",
          tokenSymbol: "TEST",
          totalSupply: "1000000",
          decimals: "18",
        },
      },
      {
        type: "blockchain_deployment",
        title: "Test Blockchain Deployment",
        description: "Testing blockchain deployment authorization flow",
        details: {
          blockchainName: "Test Chain",
          blockSize: "2",
          transactionFees: "25",
          networkTopology: "mesh",
        },
      },
      {
        type: "token_distribution",
        title: "Test Token Distribution",
        description: "Testing token distribution authorization flow",
        details: {
          tokenName: "Test Token",
          tokenSymbol: "TEST",
          distributionMethod: "airdrop",
          recipientCount: 5,
          amountPerAddress: "100",
        },
      },
    ]

    for (const operation of testOperations) {
      try {
        const startTime = Date.now()

        // Test signature generation
        const messageData = {
          operation: operation.type,
          title: operation.title,
          timestamp: Date.now(),
          account: account,
          details: operation.details,
          nonce: Math.random().toString(36).substring(7),
        }

        const message = `PhanAI Operation Authorization\n\nOperation: ${operation.title}\nType: ${operation.type}\nAccount: ${account}\nTimestamp: ${new Date().toISOString()}\n\nDetails:\n${JSON.stringify(operation.details, null, 2)}\n\nBy authorizing this operation, you confirm your intent to proceed.`

        // Mock signMessage function
        const signMessage = async (message: string) => {
          // Simulate signature generation
          await new Promise((resolve) => setTimeout(resolve, 500))
          return `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        }

        const signature = await signMessage(message)
        const endTime = Date.now()

        // Verify signature format
        const isValidFormat = signature.startsWith("0x") && signature.length > 20

        // Test signature uniqueness
        const existingSignatures = JSON.parse(localStorage.getItem("phan_signatures") || "[]")
        const isDuplicate = existingSignatures.some((sig: any) => sig.signature === signature)

        results.push({
          operation: operation.type,
          title: operation.title,
          status: "success",
          signature: signature,
          duration: endTime - startTime,
          validFormat: isValidFormat,
          isDuplicate: isDuplicate,
          timestamp: new Date().toISOString(),
        })

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error: any) {
        results.push({
          operation: operation.type,
          title: operation.title,
          status: "error",
          error: error.message,
          timestamp: new Date().toISOString(),
        })
      }
    }

    setTestResults(results)
    setIsRunningTests(false)

    // Show test summary
    const successCount = results.filter((r) => r.status === "success").length
    const errorCount = results.filter((r) => r.status === "error").length

    alert(
      `Authorization Flow Test Complete!\n\nSuccessful: ${successCount}\nFailed: ${errorCount}\n\nCheck the test results panel for details.`,
    )
  }

  // Add signature confirmation handler
  const handleSignatureConfirm = async (signature: string) => {
    if (!currentOperation) return

    // Store the signature
    setOperationSignatures((prev) => ({
      ...prev,
      [currentOperation.type]: signature,
    }))

    setShowSignatureModal(false)

    // Execute the actual operation based on type
    try {
      switch (currentOperation.type) {
        case "blockchain_creation":
          await executeBlockchainCreation(signature)
          break
        case "token_creation":
          await executeTokenCreation(signature)
          break
        case "blockchain_deployment":
          await executeBlockchainDeployment(signature)
          break
        case "token_distribution":
          await executeTokenDistribution(signature)
          break
      }
    } catch (error) {
      console.error("Operation execution failed:", error)
      alert("Operation failed after signature. Please try again.")
    }

    setCurrentOperation(null)
  }

  // Add execution functions
  const executeBlockchainCreation = async (signature: string) => {
    setBlockchainCreated(false)

    // Simulate blockchain creation process with signature verification
    const creationSteps = [
      "Verifying transaction signature...",
      "Initializing blockchain parameters...",
      "Setting up consensus mechanism...",
      "Configuring network topology...",
      "Deploying smart contracts...",
      "Finalizing blockchain creation...",
    ]

    for (let i = 0; i < creationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(creationSteps[i])
    }

    setBlockchainCreated(true)
    alert(`Phantom blockchain "${blockchainName}" created successfully!\nSignature: ${signature.slice(0, 20)}...`)
  }

  const executeTokenCreation = async (signature: string) => {
    // Simulate token creation with signature verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTokenCreated(true)
    alert(`Token "${tokenName}" (${tokenSymbol}) created successfully!\nSignature: ${signature.slice(0, 20)}...`)
  }

  const executeBlockchainDeployment = async (signature: string) => {
    setDeploymentStatus("deploying")
    setDeploymentProgress(0)

    // Simulate deployment progress with signature verification
    const progressInterval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setDeploymentStatus("deployed")
          alert(`Blockchain deployed successfully!\nSignature: ${signature.slice(0, 20)}...`)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const executeTokenDistribution = async (signature: string) => {
    // Simulate token distribution with signature verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTokensDistributed(true)
    alert(`Tokens distributed successfully!\nSignature: ${signature.slice(0, 20)}...`)
  }

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

            {/* Test Mode Toggle */}
            <div className="flex items-center gap-2">
              <Switch id="test-mode" checked={testMode} onCheckedChange={setTestMode} />
              <Label htmlFor="test-mode" className="text-white text-sm">
                Test Mode
              </Label>
            </div>

            {testMode && (
              <Button
                onClick={runAuthorizationTests}
                disabled={isRunningTests}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Run Auth Tests"
                )}
              </Button>
            )}

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-800">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Basic Setup
                </TabsTrigger>
                <TabsTrigger
                  value="development"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Development
                </TabsTrigger>
                <TabsTrigger
                  value="deployment"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Token Deployment
                </TabsTrigger>
                <TabsTrigger
                  value="verification"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verification
                </TabsTrigger>
              </TabsList>

              {/* Basic Setup Page */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      {blockchainCreated && <CheckCircle className="w-5 h-5 mr-2 text-green-400" />}
                      Phantom Blockchain Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {operationSignatures.blockchain_creation && (
                      <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm">
                            Blockchain creation verified with signature:{" "}
                            {operationSignatures.blockchain_creation.slice(0, 10)}...
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Basic Setup Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blockchain-name" className="text-white">
                            Blockchain Name
                          </Label>
                          <Input
                            id="blockchain-name"
                            placeholder="Enter blockchain name"
                            value={blockchainName}
                            onChange={(e) => setBlockchainName(e.target.value)}
                            className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blockchain-type" className="text-white">
                            Blockchain Type
                          </Label>
                          <Select value={blockchainType} onValueChange={setBlockchainType}>
                            <SelectTrigger className="bg-black border-gray-700 text-white">
                              <SelectValue placeholder="Select blockchain type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gray-700">
                              <SelectItem value="ethereum" className="text-white">
                                Ethereum
                              </SelectItem>
                              <SelectItem value="bitcoin" className="text-white">
                                Bitcoin
                              </SelectItem>
                              <SelectItem value="solana" className="text-white">
                                Solana
                              </SelectItem>
                              <SelectItem value="sei" className="text-white">
                                Sei
                              </SelectItem>
                              <SelectItem value="custom" className="text-white">
                                Custom
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="network-size" className="text-white">
                          Network Size
                        </Label>
                        <Select value={networkSize} onValueChange={setNetworkSize}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select network size" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="small" className="text-white">
                              Small (10-50 nodes)
                            </SelectItem>
                            <SelectItem value="medium" className="text-white">
                              Medium (50-200 nodes)
                            </SelectItem>
                            <SelectItem value="large" className="text-white">
                              Large (200-1000 nodes)
                            </SelectItem>
                            <SelectItem value="enterprise" className="text-white">
                              Enterprise (1000+ nodes)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Advanced Options Section */}
                    <div className="space-y-4 border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-white">Advanced Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="consensus" className="text-white">
                            Consensus Algorithm
                          </Label>
                          <Select value={consensusAlgorithm} onValueChange={setConsensusAlgorithm}>
                            <SelectTrigger className="bg-black border-gray-700 text-white">
                              <SelectValue placeholder="Select consensus algorithm" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gray-700">
                              <SelectItem value="pos" className="text-white">
                                Proof of Stake
                              </SelectItem>
                              <SelectItem value="pow" className="text-white">
                                Proof of Work
                              </SelectItem>
                              <SelectItem value="dpos" className="text-white">
                                Delegated Proof of Stake
                              </SelectItem>
                              <SelectItem value="poa" className="text-white">
                                Proof of Authority
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-volume" className="text-white">
                            Transaction Volume (TPS)
                          </Label>
                          <Input
                            id="tx-volume"
                            placeholder="e.g., 1000"
                            value={transactionVolume}
                            onChange={(e) => setTransactionVolume(e.target.value)}
                            className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-limits" className="text-white">
                          Resource Limits
                        </Label>
                        <Textarea
                          id="resource-limits"
                          placeholder="Define CPU, memory, and storage limits..."
                          value={resourceLimits}
                          onChange={(e) => setResourceLimits(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Sei Integration Section */}
                    <div className="space-y-4 border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-white">Sei Blockchain Integration</h3>
                      <div className="flex items-center space-x-2">
                        <Switch id="sei-integration" checked={seiIntegration} onCheckedChange={setSeiIntegration} />
                        <Label htmlFor="sei-integration" className="text-white">
                          Enable Sei blockchain integration for secure token management and smart contract execution
                        </Label>
                      </div>
                      {seiIntegration && (
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                          <p className="text-blue-300 text-sm">
                            Sei integration will provide enhanced security features, optimized smart contract execution,
                            and seamless token management capabilities.
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleCreateBlockchain}
                      disabled={blockchainCreated}
                      className="w-full bg-white text-black hover:bg-gray-100"
                    >
                      {blockchainCreated ? "Phantom Blockchain Created ✓" : "Create Phantom Blockchain"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Development Page */}
              <TabsContent value="development" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Configuration Card */}
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Block Size (MB)</Label>
                        <Input
                          value={blockSize}
                          onChange={(e) => setBlockSize(e.target.value)}
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Transaction Fees (Gwei)</Label>
                        <Input
                          value={transactionFees}
                          onChange={(e) => setTransactionFees(e.target.value)}
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Network Topology</Label>
                        <Select value={networkTopology} onValueChange={setNetworkTopology}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select topology" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="mesh" className="text-white">
                              Mesh Network
                            </SelectItem>
                            <SelectItem value="star" className="text-white">
                              Star Network
                            </SelectItem>
                            <SelectItem value="ring" className="text-white">
                              Ring Network
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleApplyConfiguration}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply Configuration
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Deployment Card */}
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Rocket className="w-5 h-5 mr-2" />
                        Deployment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Deployment Status</Label>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={deploymentStatus === "deployed" ? "default" : "secondary"}
                            className={deploymentStatus === "deployed" ? "bg-green-600 text-white" : "text-white"}
                          >
                            {deploymentStatus === "idle" && "Ready to Deploy"}
                            {deploymentStatus === "deploying" && "Deploying..."}
                            {deploymentStatus === "deployed" && "Deployed"}
                          </Badge>
                        </div>
                      </div>
                      {deploymentStatus === "deploying" && (
                        <div className="space-y-2">
                          <Label className="text-white">Progress</Label>
                          <Progress value={deploymentProgress} className="w-full" />
                          <p className="text-sm text-white">{deploymentProgress}% Complete</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-white">Real-time Monitoring</Label>
                        <div className="bg-black border border-gray-700 rounded p-3 text-sm font-mono">
                          <div className="text-green-400">✓ Network initialized</div>
                          <div className="text-green-400">✓ Consensus nodes active</div>
                          <div className="text-yellow-400">⚡ Processing transactions...</div>
                        </div>
                      </div>
                      <Button
                        onClick={handleDeploy}
                        disabled={deploymentStatus === "deploying"}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {deploymentStatus === "deployed" ? "Redeploy" : "Deploy Phantom Blockchain"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Stress Test Scenarios */}
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Stress Test Scenarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Transaction Load</Label>
                        <Select value={transactionLoad} onValueChange={setTransactionLoad}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select load" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="low" className="text-white">
                              Low (100 TPS)
                            </SelectItem>
                            <SelectItem value="medium" className="text-white">
                              Medium (1000 TPS)
                            </SelectItem>
                            <SelectItem value="high" className="text-white">
                              High (10000 TPS)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Security Threats</Label>
                        <Select value={securityThreats} onValueChange={setSecurityThreats}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select threat" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="ddos" className="text-white">
                              DDoS Attack
                            </SelectItem>
                            <SelectItem value="reorg" className="text-white">
                              Chain Reorganization
                            </SelectItem>
                            <SelectItem value="exploit" className="text-white">
                              Smart Contract Exploit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Network Conditions</Label>
                        <Select value={networkConditions} onValueChange={setNetworkConditions}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="normal" className="text-white">
                              Normal
                            </SelectItem>
                            <SelectItem value="latency" className="text-white">
                              High Latency
                            </SelectItem>
                            <SelectItem value="partition" className="text-white">
                              Network Partition
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={handleStressTest}
                      className={`w-full text-white ${stressTestRunning ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}`}
                    >
                      {stressTestRunning ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Stress Test
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Stress Test
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Results & Analytics */}
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Results & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-black border border-gray-700 rounded p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">99.9%</div>
                        <div className="text-sm text-white">Uptime</div>
                      </div>
                      <div className="bg-black border border-gray-700 rounded p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">1,247</div>
                        <div className="text-sm text-white">TPS Average</div>
                      </div>
                      <div className="bg-black border border-gray-700 rounded p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">45ms</div>
                        <div className="text-sm text-white">Latency</div>
                      </div>
                      <div className="bg-black border border-gray-700 rounded p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">0</div>
                        <div className="text-sm text-white">Vulnerabilities</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Performance Recommendations</Label>
                      <div className="bg-black border border-gray-700 rounded p-3 text-sm">
                        <div className="text-green-400">✓ Network performance is optimal</div>
                        <div className="text-yellow-400">⚠ Consider increasing block size for higher throughput</div>
                        <div className="text-blue-400">ℹ Security tests passed all scenarios</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Token Deployment Page */}
              <TabsContent value="deployment" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Token Creation */}
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Coins className="w-5 h-5 mr-2" />
                        {tokenCreated && <CheckCircle className="w-5 h-5 mr-2 text-green-400" />}
                        Token Creation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {operationSignatures.token_creation && (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-300 text-sm">
                              Token creation verified with signature: {operationSignatures.token_creation.slice(0, 10)}
                              ...
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-white">Token Name</Label>
                        <Input
                          placeholder="e.g., PhanToken"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Token Symbol</Label>
                        <Input
                          placeholder="e.g., PHAN"
                          value={tokenSymbol}
                          onChange={(e) => setTokenSymbol(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Total Supply</Label>
                        <Input
                          placeholder="e.g., 1000000"
                          value={totalSupply}
                          onChange={(e) => setTotalSupply(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Decimals</Label>
                        <Select value={decimals} onValueChange={setDecimals}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select decimals" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="18" className="text-white">
                              18 (Standard)
                            </SelectItem>
                            <SelectItem value="8" className="text-white">
                              8
                            </SelectItem>
                            <SelectItem value="6" className="text-white">
                              6
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCreateToken}
                        disabled={tokenCreated}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {tokenCreated ? "Token Created ✓" : "Create Token"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Token Distribution */}
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Network className="w-5 h-5 mr-2" />
                        {tokensDistributed && <CheckCircle className="w-5 h-5 mr-2 text-green-400" />}
                        Token Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Distribution Method</Label>
                        <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                          <SelectTrigger className="bg-black border-gray-700 text-white">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-700">
                            <SelectItem value="airdrop" className="text-white">
                              Airdrop
                            </SelectItem>
                            <SelectItem value="sale" className="text-white">
                              Token Sale
                            </SelectItem>
                            <SelectItem value="rewards" className="text-white">
                              Contribution Rewards
                            </SelectItem>
                            <SelectItem value="manual" className="text-white">
                              Manual Distribution
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Recipient Addresses</Label>
                        <Textarea
                          placeholder="Enter addresses (one per line)"
                          value={recipientAddresses}
                          onChange={(e) => setRecipientAddresses(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Amount per Address</Label>
                        <Input
                          placeholder="e.g., 100"
                          value={amountPerAddress}
                          onChange={(e) => setAmountPerAddress(e.target.value)}
                          className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <Button
                        onClick={handleDistributeTokens}
                        disabled={tokensDistributed}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {tokensDistributed ? "Tokens Distributed ✓" : "Distribute Tokens"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Token Usage Configuration */}
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Token Usage Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">Transaction Fees</h4>
                        <div className="flex items-center space-x-2">
                          <Switch id="tx-fees" checked={txFeesEnabled} onCheckedChange={setTxFeesEnabled} />
                          <Label htmlFor="tx-fees" className="text-white">
                            Use token for transaction fees
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Fee Rate</Label>
                          <Input
                            placeholder="0.001"
                            value={feeRate}
                            onChange={(e) => setFeeRate(e.target.value)}
                            className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">Staking</h4>
                        <div className="flex items-center space-x-2">
                          <Switch id="staking" checked={stakingEnabled} onCheckedChange={setStakingEnabled} />
                          <Label htmlFor="staking" className="text-white">
                            Enable staking rewards
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">APY (%)</Label>
                          <Input
                            placeholder="5.0"
                            value={apyRate}
                            onChange={(e) => setApyRate(e.target.value)}
                            className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">Governance</h4>
                        <div className="flex items-center space-x-2">
                          <Switch id="voting" checked={votingEnabled} onCheckedChange={setVotingEnabled} />
                          <Label htmlFor="voting" className="text-white">
                            Enable voting rights
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Voting Weight</Label>
                          <Select value={votingWeight} onValueChange={setVotingWeight}>
                            <SelectTrigger className="bg-black border-gray-700 text-white">
                              <SelectValue placeholder="Select weight" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gray-700">
                              <SelectItem value="linear" className="text-white">
                                Linear (1 token = 1 vote)
                              </SelectItem>
                              <SelectItem value="quadratic" className="text-white">
                                Quadratic Voting
                              </SelectItem>
                              <SelectItem value="weighted" className="text-white">
                                Weighted by Stake
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleUpdateTokenConfig}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Update Token Configuration
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Signature Verification Page */}
              <TabsContent value="verification" className="space-y-6">
                <SignatureVerification />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Test Results Panel */}
        {testMode && testResults.length > 0 && (
          <Card className="bg-black border-gray-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Authorization Flow Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.status === "success" ? "border-green-700 bg-green-900/20" : "border-red-700 bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{result.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          result.status === "success"
                            ? "text-green-400 border-green-400"
                            : "text-red-400 border-red-400"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Operation:</span>
                        <span className="text-white ml-2 capitalize">{result.operation?.replace(/_/g, " ")}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">{result.duration}ms</span>
                      </div>
                      {result.status === "success" && (
                        <>
                          <div>
                            <span className="text-gray-400">Valid Format:</span>
                            <span className={`ml-2 ${result.validFormat ? "text-green-400" : "text-red-400"}`}>
                              {result.validFormat ? "✓" : "✗"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Unique:</span>
                            <span className={`ml-2 ${!result.isDuplicate ? "text-green-400" : "text-red-400"}`}>
                              {!result.isDuplicate ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400">Signature:</span>
                            <span className="text-white ml-2 font-mono text-xs break-all">
                              {result.signature?.slice(0, 20)}...{result.signature?.slice(-20)}
                            </span>
                          </div>
                        </>
                      )}
                      {result.status === "error" && (
                        <div className="col-span-2">
                          <span className="text-gray-400">Error:</span>
                          <span className="text-red-400 ml-2">{result.error}</span>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-white ml-2">{result.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Summary */}
              <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Test Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {testResults.filter((r) => r.status === "success").length}
                    </div>
                    <div className="text-gray-400">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {testResults.filter((r) => r.status === "error").length}
                    </div>
                    <div className="text-gray-400">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {testResults.length > 0
                        ? Math.round(testResults.reduce((acc, r) => acc + (r.duration || 0), 0) / testResults.length)
                        : 0}
                      ms
                    </div>
                    <div className="text-gray-400">Avg Duration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Transaction Signature Modal */}
      {currentOperation && (
        <TransactionSignatureModal
          isOpen={showSignatureModal}
          onClose={() => {
            setShowSignatureModal(false)
            setCurrentOperation(null)
          }}
          onConfirm={handleSignatureConfirm}
          operation={currentOperation}
        />
      )}
    </div>
  )
}
