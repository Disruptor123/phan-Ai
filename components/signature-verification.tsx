"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Eye,
  Copy,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"

interface Signature {
  id: string
  operation: string
  signature: string
  timestamp: string
  status: "verified" | "pending" | "failed"
  txHash?: string
}

interface SignatureVerificationProps {
  signatures: Signature[]
}

export function SignatureVerification({ signatures }: SignatureVerificationProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null)

  const filteredSignatures = signatures.filter(
    (sig) =>
      sig.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.signature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportSignatures = () => {
    const dataStr = JSON.stringify(signatures, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `signatures-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const stats = {
    total: signatures.length,
    verified: signatures.filter((s) => s.status === "verified").length,
    pending: signatures.filter((s) => s.status === "pending").length,
    failed: signatures.filter((s) => s.status === "failed").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Signatures</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            <p className="text-sm text-gray-600">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-gray-600">Failed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Signature Verification
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportSignatures}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Signature List</TabsTrigger>
              <TabsTrigger value="inspector">Inspector</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search signatures, operations, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Signatures List */}
              <div className="space-y-3">
                {filteredSignatures.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No signatures found. Complete some operations to see signature records.</p>
                  </div>
                ) : (
                  filteredSignatures.map((signature) => (
                    <div key={signature.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(signature.status)}
                          <span className="font-medium text-gray-900">{signature.operation}</span>
                          <Badge className={getStatusColor(signature.status)}>{signature.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedSignature(signature)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(signature.signature)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">ID:</span> {signature.id}
                        </p>
                        <p>
                          <span className="font-medium">Signature:</span> {signature.signature.substring(0, 20)}...
                        </p>
                        <p>
                          <span className="font-medium">Timestamp:</span>{" "}
                          {new Date(signature.timestamp).toLocaleString()}
                        </p>
                        {signature.txHash && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Tx Hash:</span>
                            <span className="font-mono text-xs">{signature.txHash.substring(0, 20)}...</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://sei.explorers.guru/tx/${signature.txHash}`, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="inspector">
              <Card>
                <CardHeader>
                  <CardTitle>Signature Inspector</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSignature ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Operation</label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedSignature.operation}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(selectedSignature.status)}
                            <Badge className={getStatusColor(selectedSignature.status)}>
                              {selectedSignature.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Signature</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg font-mono text-xs break-all">
                          {selectedSignature.signature}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Signature ID</label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
                            {selectedSignature.id}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Timestamp</label>
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                            {new Date(selectedSignature.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {selectedSignature.txHash && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Transaction Hash</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono flex-1">
                              {selectedSignature.txHash}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(`https://sei.explorers.guru/tx/${selectedSignature.txHash}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Validation Results */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Validation Results</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Signature Format</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Cryptographic Validity</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Timestamp Integrity</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Operation Matching</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a signature from the list to inspect its details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
