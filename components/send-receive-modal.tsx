"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSeiWallet } from "@/lib/sei-wallet"
import { Send, Download, Copy, QrCode, AlertCircle } from "lucide-react"

interface SendReceiveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendReceiveModal({ isOpen, onClose }: SendReceiveModalProps) {
  const { account, assets, sendTransaction } = useSeiWallet()
  const [activeTab, setActiveTab] = useState("send")

  // Send form state
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("SEI")
  const [memo, setMemo] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!recipient || !amount) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSending(true)
      const txHash = await sendTransaction(recipient, amount, memo)
      alert(`Transaction sent successfully!\nTx Hash: ${txHash}`)
      onClose()
    } catch (error) {
      console.error("Send failed:", error)
      alert("Transaction failed. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      alert("Address copied to clipboard!")
    }
  }

  const selectedAssetData = assets.find((asset) => asset.symbol === selectedAsset)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send & Receive</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Receive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{asset.logo}</span>
                        <span>{asset.symbol}</span>
                        <span className="text-gray-500">({asset.balance})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="sei1..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                {selectedAssetData && (
                  <span className="text-sm text-gray-500">
                    Balance: {selectedAssetData.balance} {selectedAsset}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">{selectedAsset}</span>
                </div>
              </div>
              {selectedAssetData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAmount(selectedAssetData.balance)}
                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  Use Max
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                placeholder="Add a note..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Transaction Fee</p>
                <p>Network fee: ~0.001 SEI</p>
              </div>
            </div>

            <Button onClick={handleSend} disabled={isSending || !recipient || !amount} className="w-full">
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send {selectedAsset}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="receive" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="p-6 bg-gray-50 rounded-lg">
                <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Your SEI Address</p>
                <div className="p-3 bg-white border rounded-lg">
                  <p className="font-mono text-sm break-all text-gray-900">{account || "Not connected"}</p>
                </div>
              </div>

              <Button onClick={copyAddress} variant="outline" className="w-full bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </Button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Important</p>
                    <p>
                      Only send SEI and compatible tokens to this address. Sending other assets may result in permanent
                      loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
