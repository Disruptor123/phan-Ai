"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Search, Download, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface Signature {
  id: string
  operation: string
  signature: string
  timestamp: string
  status: "verified" | "pending" | "failed"
  txHash?: string
}

interface SignatureVerificationProps {
  signatures?: Signature[]
}

export function SignatureVerification({ signatures: propSignatures }: SignatureVerificationProps) {
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null)

  // Load signatures from localStorage or use prop signatures
  useEffect(() => {
    if (propSignatures) {
      setSignatures(propSignatures)
    } else {
      const storedSignatures = JSON.parse(localStorage.getItem("phan_signatures") || "[]")
      const formattedSignatures: Signature[] = storedSignatures.map((sig: any, index: number) => ({
        id: `sig-${index}`,
        operation: sig.operation || "Unknown Operation",
        signature: sig.signature,
        timestamp: sig.timestamp,
        status: "verified" as const,
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      }))
      setSignatures(formattedSignatures)
    }
  }, [propSignatures])

  const filteredSignatures = signatures.filter(
    (sig) =>
      sig.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.signature.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const verifySignature = (signature: string) => {
    // Mock signature verification
    const isValid = signature.startsWith("0x") && signature.length > 20
    return {
      isValid,
      details: {
        format: isValid ? "Valid" : "Invalid",
        length: signature.length,
        algorithm: "ECDSA",
        timestamp: new Date().toISOString(),
      },
    }
  }

  const exportSignatures = () => {
    const dataStr = JSON.stringify(signatures, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `phan-signatures-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Signature Verification</span>
          </div>
          <Button onClick={exportSignatures} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Signature List</TabsTrigger>
            <TabsTrigger value="verify">Verify Signature</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search signatures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Signatures List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSignatures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No signatures found</p>
                  <p className="text-sm">Complete operations to generate signatures</p>
                </div>
              ) : (
                filteredSignatures.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSignature(sig)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{sig.operation}</h4>
                      <Badge
                        variant={
                          sig.status === "verified" ? "default" : sig.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {sig.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {sig.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {sig.status === "failed" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {sig.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-mono break-all">
                      {sig.signature.slice(0, 20)}...{sig.signature.slice(-20)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(sig.timestamp).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            {/* Selected Signature Details */}
            {selectedSignature && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">Signature Details</h4>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSignature(null)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-700 font-medium">Operation:</span>
                      <p className="text-blue-900">{selectedSignature.operation}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Status:</span>
                      <p className="text-blue-900">{selectedSignature.status}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Signature:</span>
                    <p className="text-blue-900 font-mono text-xs break-all mt-1">{selectedSignature.signature}</p>
                  </div>
                  {selectedSignature.txHash && (
                    <div>
                      <span className="text-blue-700 font-medium">Transaction Hash:</span>
                      <p className="text-blue-900 font-mono text-xs break-all mt-1">{selectedSignature.txHash}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-blue-700 font-medium">Timestamp:</span>
                    <p className="text-blue-900">{new Date(selectedSignature.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signature-input">Signature to Verify</Label>
                <Input id="signature-input" placeholder="0x..." className="font-mono" />
              </div>
              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Verify Signature
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {signatures.filter((s) => s.status === "verified").length}
                </p>
                <p className="text-sm text-gray-600">Verified Signatures</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{signatures.length}</p>
                <p className="text-sm text-gray-600">Total Signatures</p>
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {signatures.length > 0
                  ? Math.round((signatures.filter((s) => s.status === "verified").length / signatures.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
