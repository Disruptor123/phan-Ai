"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, ArrowDownToLine, Copy, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useSeiWallet } from "@/lib/sei-wallet"

interface SendReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "send" | "receive"
}

export function SendReceiveModal({ isOpen, onClose, mode }: SendReceiveModalProps) {
  const { account, sendTransaction, assets } = useSeiWallet()

  // Send form state
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("SEI")
  const [memo, setMemo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [error, setError] = useState("")

  // Receive state
  const [generatedAddress] = useState(account || "")

  const handleSend = async () => {
    if (!recipientAddress || !amount) {
      setError("Please fill in all required fields")
      return
    }

    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Invalid recipient address format")
      return
    }

    if (Number.parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const txHash = await sendTransaction(recipientAddress, amount, memo)
      setTransactionHash(txHash)

      // Reset form
      setRecipientAddress("")
      setAmount("")
      setMemo("")

      alert(`Transaction sent successfully! Hash: ${txHash}`)
    } catch (error: any) {
      setError(error.message || "Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = () => {
    if (generatedAddress) {
      navigator.clipboard.writeText(generatedAddress)
      alert("Address copied to clipboard!")
    }
  }

  const copyTransactionHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash)
      alert("Transaction hash copied to clipboard!")
    }
  }

  const resetForm = () => {
    setRecipientAddress("")
    setAmount("")
    setMemo("")
    setError("")
    setTransactionHash("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            {mode === "send" ? (
              <>
                <Send className="w-5 h-5 mr-2 text-red-400" />
                Send Tokens
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-5 h-5 mr-2 text-green-400" />
                Receive Tokens
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {mode === "send" ? (
          <div className="space-y-4">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label className="text-white">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="bg-black border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  {assets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol} className="text-white">
                      <div className="flex items-center space-x-2">
                        <span>{asset.logo}</span>
                        <span>{asset.symbol}</span>
                        <span className="text-gray-400">({asset.balance})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Address */}
            <div className="space-y-2">
              <Label className="text-white">Recipient Address</Label>
              <Input
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-black border-gray-700 text-white placeholder:text-gray-400 font-mono text-sm"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-white">Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black border-gray-700 text-white placeholder:text-gray-400 pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  {selectedAsset}
                </div>
              </div>
            </div>

            {/* Memo (Optional) */}
            <div className="space-y-2">
              <Label className="text-white">Memo (Optional)</Label>
              <Textarea
                placeholder="Transaction note..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="bg-black border-gray-700 text-white placeholder:text-gray-400 resize-none"
                rows={2}
              />
            </div>

            {/* Transaction Summary */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-white">~0.001 SEI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white">{amount ? `${amount} ${selectedAsset} + fee` : "0.00"}</span>
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

            {/* Transaction Success */}
            {transactionHash && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm font-medium">Transaction Sent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300 text-xs font-mono">
                    {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      onClick={copyTransactionHash}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-auto text-green-400 hover:text-green-300"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1 h-auto text-green-400 hover:text-green-300">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={isLoading || !recipientAddress || !amount}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send {selectedAsset}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Receive Address */}
            <div className="space-y-2">
              <Label className="text-white">Your Wallet Address</Label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="text-center space-y-3">
                  {/* QR Code Placeholder */}
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <div className="text-black text-xs font-mono break-all p-2">{generatedAddress.slice(0, 20)}...</div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <div className="text-white font-mono text-sm break-all bg-black border border-gray-600 rounded p-2">
                      {generatedAddress}
                    </div>
                    <Button onClick={copyAddress} size="sm" className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-2">How to receive tokens:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Share this address with the sender</li>
                  <li>• Only send SEI network compatible tokens</li>
                  <li>• Double-check the address before sharing</li>
                  <li>• Transactions are irreversible</li>
                </ul>
              </CardContent>
            </Card>

            {/* Supported Assets */}
            <div className="space-y-2">
              <Label className="text-white">Supported Assets</Label>
              <div className="flex flex-wrap gap-2">
                {assets.map((asset) => (
                  <Badge key={asset.symbol} variant="outline" className="text-white border-gray-600">
                    {asset.logo} {asset.symbol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-gray-700" />

        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
