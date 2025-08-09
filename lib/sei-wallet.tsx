"use client"

import "@sei-js/sei-global-wallet/eip6963"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: any
}

interface SeiWalletContextType {
  account: string | null
  chainId: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  provider: any
}

const SeiWalletContext = createContext<SeiWalletContextType | null>(null)

function findSeiGlobalWallet(): any {
  if (typeof window === "undefined") return null

  const providers = new Map<string, EIP6963ProviderDetail>()

  const handleProviderAnnouncement = (event: Event) => {
    const customEvent = event as CustomEvent<EIP6963ProviderDetail>
    providers.set(customEvent.detail.info.uuid, customEvent.detail)
  }

  window.addEventListener("eip6963:announceProvider", handleProviderAnnouncement as EventListener)
  window.dispatchEvent(new Event("eip6963:requestProvider"))

  // Give some time for providers to announce themselves
  setTimeout(() => {
    window.removeEventListener("eip6963:announceProvider", handleProviderAnnouncement)
  }, 100)

  for (const [uuid, provider] of providers) {
    if (provider.info.name.toLowerCase().includes("sei") || provider.info.rdns.includes("sei")) {
      return provider.provider
    }
  }

  // Fallback to window.ethereum if Sei wallet not found via EIP-6963
  return (window as any).ethereum
}

export function SeiWalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<any>(null)

  const updateAccountInfo = useCallback(async (walletProvider: any) => {
    try {
      const accounts = await walletProvider.request({ method: "eth_accounts" })
      const currentChainId = await walletProvider.request({ method: "eth_chainId" })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setChainId(currentChainId)
        setIsConnected(true)

        // Store in localStorage
        localStorage.setItem("sei_wallet_connected", "true")
        localStorage.setItem("sei_wallet_address", accounts[0])
      } else {
        setAccount(null)
        setChainId(null)
        setIsConnected(false)
      }
    } catch (error) {
      console.error("Error updating account info:", error)
      setAccount(null)
      setChainId(null)
      setIsConnected(false)
    }
  }, [])

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)

      const seiProvider = findSeiGlobalWallet()
      if (!seiProvider) {
        throw new Error("Sei Global Wallet not found. Please install the Sei wallet extension.")
      }

      setProvider(seiProvider)

      // Request account access
      await seiProvider.request({ method: "eth_requestAccounts" })
      await updateAccountInfo(seiProvider)

      // Set up event listeners
      seiProvider.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          localStorage.setItem("sei_wallet_address", accounts[0])
        } else {
          disconnect()
        }
      })

      seiProvider.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId)
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [updateAccountInfo])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setIsConnected(false)
    setProvider(null)

    // Clear localStorage
    localStorage.removeItem("sei_wallet_connected")
    localStorage.removeItem("sei_wallet_address")
  }, [])

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem("sei_wallet_connected")
      if (wasConnected === "true") {
        try {
          const seiProvider = findSeiGlobalWallet()
          if (seiProvider) {
            setProvider(seiProvider)
            await updateAccountInfo(seiProvider)
          }
        } catch (error) {
          console.error("Auto-connect failed:", error)
          disconnect()
        }
      }
    }

    autoConnect()
  }, [updateAccountInfo, disconnect])

  const value: SeiWalletContextType = {
    account,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    provider,
  }

  return <SeiWalletContext.Provider value={value}>{children}</SeiWalletContext.Provider>
}

export function useSeiWallet() {
  const context = useContext(SeiWalletContext)
  if (!context) {
    throw new Error("useSeiWallet must be used within a SeiWalletProvider")
  }
  return context
}
