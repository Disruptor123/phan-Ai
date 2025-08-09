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
  balance: string | null
  isLoadingBalance: boolean
  assets: Asset[]
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
  provider: any
  signMessage: (message: string) => Promise<string>
  sendTransaction: (to: string, amount: string, memo?: string) => Promise<string>
}

interface Asset {
  symbol: string
  name: string
  balance: string
  decimals: number
  contractAddress?: string
  logo?: string
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
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [provider, setProvider] = useState<any>(null)

  const fetchBalance = useCallback(async (walletProvider: any, walletAccount: string) => {
    try {
      setIsLoadingBalance(true)

      // Fetch SEI balance
      const seiBalance = await walletProvider.request({
        method: "eth_getBalance",
        params: [walletAccount, "latest"],
      })

      // Convert from wei to SEI (18 decimals)
      const balanceInSei = (Number.parseInt(seiBalance, 16) / Math.pow(10, 18)).toFixed(6)
      setBalance(balanceInSei)

      // Mock additional assets for demonstration
      const mockAssets: Asset[] = [
        {
          symbol: "SEI",
          name: "Sei Network",
          balance: balanceInSei,
          decimals: 18,
          logo: "🔴",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          balance: "1,250.00",
          decimals: 6,
          contractAddress: "0x...",
          logo: "💵",
        },
        {
          symbol: "PHAN",
          name: "PhanAI Token",
          balance: "10,000.00",
          decimals: 18,
          contractAddress: "0x...",
          logo: "👻",
        },
      ]

      setAssets(mockAssets)
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("0.000000")
      setAssets([])
    } finally {
      setIsLoadingBalance(false)
    }
  }, [])

  const refreshBalance = useCallback(async () => {
    if (provider && account) {
      await fetchBalance(provider, account)
    }
  }, [provider, account, fetchBalance])

  // Update the updateAccountInfo function to include balance fetching
  const updateAccountInfo = useCallback(
    async (walletProvider: any) => {
      try {
        const accounts = await walletProvider.request({ method: "eth_accounts" })
        const currentChainId = await walletProvider.request({ method: "eth_chainId" })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setChainId(currentChainId)
          setIsConnected(true)

          // Fetch balance
          await fetchBalance(walletProvider, accounts[0])

          // Store in localStorage
          localStorage.setItem("sei_wallet_connected", "true")
          localStorage.setItem("sei_wallet_address", accounts[0])
        } else {
          setAccount(null)
          setChainId(null)
          setIsConnected(false)
          setBalance(null)
          setAssets([])
        }
      } catch (error) {
        console.error("Error updating account info:", error)
        setAccount(null)
        setChainId(null)
        setIsConnected(false)
        setBalance(null)
        setAssets([])
      }
    },
    [fetchBalance],
  )

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setIsConnected(false)
    setProvider(null)
    setBalance(null)
    setAssets([])

    // Clear localStorage
    localStorage.removeItem("sei_wallet_connected")
    localStorage.removeItem("sei_wallet_address")
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
  }, [updateAccountInfo, disconnect])

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

  const signMessage = useCallback(
    async (message: string) => {
      if (!provider || !account) {
        throw new Error("Wallet not connected")
      }

      try {
        // Convert message to hex if it's not already
        const messageHex = message.startsWith("0x") ? message : `0x${Buffer.from(message, "utf8").toString("hex")}`

        // Try personal_sign first (most common)
        try {
          const signature = await provider.request({
            method: "personal_sign",
            params: [messageHex, account],
          })
          return signature
        } catch (personalSignError) {
          console.log("personal_sign failed, trying eth_sign:", personalSignError)

          // Fallback to eth_sign
          const signature = await provider.request({
            method: "eth_sign",
            params: [account, messageHex],
          })
          return signature
        }
      } catch (error) {
        console.error("Message signing failed:", error)
        throw new Error("Failed to sign message. Please try again.")
      }
    },
    [provider, account],
  )

  const sendTransaction = useCallback(
    async (to: string, amount: string, memo?: string) => {
      if (!provider || !account) {
        throw new Error("Wallet not connected")
      }

      try {
        // Convert amount to wei (assuming 18 decimals for SEI)
        const amountWei = `0x${(Number.parseFloat(amount) * Math.pow(10, 18)).toString(16)}`

        const transaction = {
          from: account,
          to: to,
          value: amountWei,
          gas: "0x5208", // 21000 gas limit
          gasPrice: "0x9184e72a000", // 10 gwei
          data: memo ? `0x${Buffer.from(memo, "utf8").toString("hex")}` : "0x",
        }

        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transaction],
        })

        return txHash
      } catch (error) {
        console.error("Transaction failed:", error)
        throw error
      }
    },
    [provider, account],
  )

  // Update the value object to include new properties
  const value: SeiWalletContextType = {
    account,
    chainId,
    isConnected,
    isConnecting,
    balance,
    isLoadingBalance,
    assets,
    connect,
    disconnect,
    refreshBalance,
    provider,
    signMessage,
    sendTransaction,
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
