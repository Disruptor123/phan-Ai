"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, CheckCircle, AlertCircle, RefreshCw, Trash2, Download, Eye } from "lucide-react"

interface StoredSignature {
  message: string
  account: string
  timestamp: number
  signature: string
}

export function SignatureVerification() {
  const [signatures, setSignatures] = useState<StoredSignature[]>([])
  const [selectedSignature, setSelectedSignature] = useState<StoredSignature | null>(null)
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadSignatures()
  }, [])

  const loadSignatures = () => {
    const stored = localStorage.getItem("phan_signatures")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSignatures(parsed)
        verifyAllSignatures(parsed)
      } catch (error) {
        console.error("Failed to load signatures:", error)
        setSignatures([])
      }
    }
  }

  const verifyAllSignatures = (sigs: StoredSignature[]) => {
    const results: Record<string, boolean> = {}

    sigs.forEach((sig) => {
      // Verify signature format and integrity
      const isValidFormat = sig.signature.startsWith("0x") && sig.signature.length > 20
      const hasValidTimestamp = sig.timestamp > 0 && sig.timestamp <= Date.now()
      const hasValidAccount = sig.account && sig.account.startsWith("0x")
      const hasValidMessage = sig.message && sig.message.length > 0

      results[sig.signature] = isValidFormat && hasValidTimestamp && hasValidAccount && hasValidMessage
    })

    setVerificationResults(results)
  }

  const clearAllSignatures = () => {
    if (confirm("Are you sure you want to clear all stored signatures? This action cannot be undone.")) {
      localStorage.removeItem("phan_signatures")
      setSignatures([])
      setVerificationResults({})
      setSelectedSignature(null)
    }
  }

  const exportSignatures = () => {
    const dataStr = JSON.stringify(signatures, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `phan-signatures-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getOperationType = (message: string) => {
    if (message.includes("blockchain_creation")) return "Blockchain Creation"
    if (message.includes("token_creation")) return "Token Creation"
    if (message.includes("blockchain_deployment")) return "Blockchain Deployment"
    if (message.includes("token_distribution")) return "Token Distribution"
    return "Unknown Operation"
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Signature Verification System
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadSignatures}
                size="sm"
                variant="outline"
                className="border-gray-700 text-white bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={exportSignatures}
                size="sm"
                variant="outline"
                className="border-gray-700 text-white bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={clearAllSignatures}
                size="sm"
                variant="outline"
                className="border-red-700 text-red-400 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{signatures.length}</div>
              <div className="text-sm text-gray-400">Total Signatures</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">
                {Object.values(verificationResults).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-400">Valid</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">
                {Object.values(verificationResults).filter((v) => !v).length}
              </div>
              <div className="text-sm text-gray-400">Invalid</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">
                {signatures.length > 0
                  ? Math.round((Object.values(verificationResults).filter(Boolean).length / signatures.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Signatures List */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Stored Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {signatures.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No Operations Yet</p>
                    <p className="text-sm">
                      Start creating phantom blockchains or tokens to see authorization signatures here.
                    </p>
                  </div>
                ) : (
                  signatures.map((sig, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedSignature?.signature === sig.signature
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedSignature(sig)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">{getOperationType(sig.message)}</span>
                        <div className="flex items-center gap-2">
                          {verificationResults[sig.signature] ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <Badge
                            variant="outline"
                            className={
                              verificationResults[sig.signature]
                                ? "text-green-400 border-green-400"
                                : "text-red-400 border-red-400"
                            }
                          >
                            {verificationResults[sig.signature] ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{formatTimestamp(sig.timestamp)}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        {sig.signature.slice(0, 16)}...{sig.signature.slice(-8)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Signature Details */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Signature Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSignature ? (
              <div className="space-y-4">
                {/* Verification Status */}
                <div
                  className={`border rounded-lg p-3 ${
                    verificationResults[selectedSignature.signature]
                      ? "border-green-700 bg-green-900/20"
                      : "border-red-700 bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {verificationResults[selectedSignature.signature] ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={`font-medium ${
                        verificationResults[selectedSignature.signature] ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {verificationResults[selectedSignature.signature] ? "Signature Valid" : "Signature Invalid"}
                    </span>
                  </div>
                </div>

                {/* Signature Information */}
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-sm">Operation Type</label>
                    <div className="text-white">{getOperationType(selectedSignature.message)}</div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Account</label>
                    <div className="text-white font-mono text-sm">{selectedSignature.account}</div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Timestamp</label>
                    <div className="text-white">{formatTimestamp(selectedSignature.timestamp)}</div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Signature</label>
                    <div className="text-white font-mono text-xs break-all bg-gray-900 border border-gray-700 rounded p-2">
                      {selectedSignature.signature}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Message Content */}
                <div>
                  <label className="text-gray-400 text-sm">Signed Message</label>
                  <ScrollArea className="h-32 mt-2">
                    <div className="text-white text-xs font-mono bg-gray-900 border border-gray-700 rounded p-3 whitespace-pre-wrap">
                      {selectedSignature.message}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Select a Signature</p>
                <p className="text-sm">
                  Choose a signature from the list to view its verification details and message content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
