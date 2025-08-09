"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSeiWallet } from "@/lib/sei-wallet"
import { Shield, AlertTriangle, CheckCircle, X } from "lucide-react"

interface TransactionSignatureModalProps {
  isOpen: boolean
  onClose: () => void
  operation?: {
    type: string
    title: string
    description: string
    details: any
    estimatedGas?: string
  }
  onConfirm?: (signature: string) => void
}

export function TransactionSignatureModal({ isOpen, onClose, operation, onConfirm }: TransactionSignatureModalProps) {
  const { account, signMessage } = useSeiWallet()
  const [isSigning, setIsSigning] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSign = async () => {
    if (!operation) return

    try {
      setIsSigning(true)
      setError(null)

      const message = `PhanAI Operation Authorization

Operation: ${operation.title}
Type: ${operation.type}
Account: ${account}
Timestamp: ${new Date().toISOString()}

Details:
${JSON.stringify(operation.details, null, 2)}

By signing this message, you authorize the execution of this operation.`

      const sig = await signMessage(message)
      setSignature(sig)

      // Auto-confirm after successful signing
      setTimeout(() => {
        if (onConfirm) {
          onConfirm(sig)
        }
        handleClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to sign transaction")
    } finally {
      setIsSigning(false)
    }
  }

  const handleClose = () => {
    setSignature(null)
    setError(null)
    setIsSigning(false)
    onClose()
  }

  if (!operation) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Transaction Signature Required</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{operation.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{operation.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Operation Type:</span>
                <Badge variant="outline">{operation.type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Account:</span>
                <span className="font-mono text-xs">
                  {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "Not connected"}
                </span>
              </div>
              {operation.estimatedGas && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Gas:</span>
                  <span className="text-green-600">{operation.estimatedGas}</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Security Notice</p>
              <p>
                This signature authorizes the execution of the operation described above. Only sign if you trust this
                application and understand the consequences.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <X className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Signature Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Success Display */}
          {signature && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Signature Generated</p>
                <p className="font-mono text-xs break-all mt-1">{signature}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isSigning} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSign}
              disabled={isSigning || !!signature}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing...
                </>
              ) : signature ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Signed
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Sign Transaction
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
