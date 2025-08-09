"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, CheckCircle, AlertCircle, Loader2, FileText, Wallet, Info } from "lucide-react"
import { useSeiWallet } from "@/lib/sei-wallet"

interface TransactionSignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (signature: string) => void
  operation: {
    type: "blockchain_creation" | "token_creation" | "blockchain_deployment" | "token_distribution"
    title: string
    description: string
    details: Record<string, any>
    estimatedGas?: string
  }
}

export function TransactionSignatureModal({ isOpen, onClose, onConfirm, operation }: TransactionSignatureModalProps) {
  const { account, signMessage, provider } = useSeiWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [signature, setSignature] = useState("")

  const getOperationIcon = () => {
    switch (operation.type) {
      case "blockchain_creation":
        return <Shield className="w-6 h-6 text-blue-400" />
      case "token_creation":
        return <FileText className="w-6 h-6 text-purple-400" />
      case "blockchain_deployment":
        return <Shield className="w-6 h-6 text-green-400" />
      case "token_distribution":
        return <FileText className="w-6 h-6 text-orange-400" />
      default:
        return <Shield className="w-6 h-6 text-gray-400" />
    }
  }

  const getOperationColor = () => {
    switch (operation.type) {
      case "blockchain_creation":
        return "border-blue-700 bg-blue-900/20"
      case "token_creation":
        return "border-purple-700 bg-purple-900/20"
      case "blockchain_deployment":
        return "border-green-700 bg-green-900/20"
      case "token_distribution":
        return "border-orange-700 bg-orange-900/20"
      default:
        return "border-gray-700 bg-gray-900/20"
    }
  }

  const handleSign = async () => {
    if (!provider || !account) {
      setError("Wallet not connected")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Create a message to sign for verification
      const messageData = {
        operation: operation.type,
        title: operation.title,
        timestamp: Date.now(),
        account: account,
        details: operation.details,
        nonce: Math.random().toString(36).substring(7),
      }

      const message = `PhanAI Operation Authorization\n\nOperation: ${operation.title}\nType: ${operation.type}\nAccount: ${account}\nTimestamp: ${new Date().toISOString()}\n\nDetails:\n${JSON.stringify(operation.details, null, 2)}\n\nBy authorizing this operation, you confirm your intent to proceed.`

      const messageSignature = await signMessage(message)
      setSignature(messageSignature)

      // Call the confirmation callback
      onConfirm(messageSignature)
    } catch (error: any) {
      console.error("Authorization error:", error)
      setError(error.message || "Failed to authorize operation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setError("")
    setSignature("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Wallet className="w-5 h-5 mr-2 text-red-400" />
            Operation Authorization Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Operation Details */}
          <Card className={`border ${getOperationColor()}`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {getOperationIcon()}
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{operation.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{operation.description}</p>

                  {/* Operation Details */}
                  <div className="space-y-2">
                    {Object.entries(operation.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                        <span className="text-white font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Info */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-white font-medium">Authorization Information</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Authorizer:</span>
                  <span className="text-white font-mono">
                    {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                    Sei Network
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-white">Phantom Blockchain Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Operation Type:</span>
                  <span className="text-white capitalize">{operation.type.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Authorization Method:</span>
                  <span className="text-white">Wallet Verification</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phantom Blockchain Notice */}
          <Card className="bg-blue-900/20 border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">Phantom Blockchain Environment</p>
                  <p className="text-blue-200">
                    This operation will be executed in a secure phantom blockchain environment. No real assets are at
                    risk, and all operations are for testing and development purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {signature && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Operation Authorized Successfully</span>
              </div>
              <div className="text-green-300 text-xs font-mono break-all">
                Authorization ID: {signature.slice(0, 20)}...{signature.slice(-20)}
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-700" />

        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSign}
            disabled={isLoading || !!signature}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authorizing...
              </>
            ) : signature ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Authorized
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Authorize Operation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
