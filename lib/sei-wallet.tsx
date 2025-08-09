"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Asset {
  symbol: string
  name: string
  balance: string
  usdValue: string
  icon: string
}

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  usdBalance: string
  assets: Asset[]
  phantomBalance: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  addPhanTokens: (amount: number) => void
  spendPhanTokens: (amount: number) => boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.000000")
  const [phantomBalance, setPhantomBalance] = useState("0")

  // Load PHAN balance from localStorage
  useEffect(() => {
    if (address) {
      const savedBalance = localStorage.getItem(`phan_balance_${address}`)
      if (savedBalance) {
        setPhantomBalance(savedBalance)
      }
    }
  }, [address])

  // Save PHAN balance to localStorage
  const savePhanBalance = (newBalance: string) => {
    if (address) {
      localStorage.setItem(`phan_balance_${address}`, newBalance)
      setPhantomBalance(newBalance)
    }
  }

  const addPhanTokens = (amount: number) => {
    const currentBalance = Number.parseFloat(phantomBalance)
    const newBalance = (currentBalance + amount).toString()
    savePhanBalance(newBalance)
  }

  const spendPhanTokens = (amount: number): boolean => {
    const currentBalance = Number.parseFloat(phantomBalance)
    if (currentBalance >= amount) {
      const newBalance = (currentBalance - amount).toString()
      savePhanBalance(newBalance)
      return true
    }
    return false
  }

  const seiPrice = 0.45 // Mock SEI price in USD
  const phantomPrice = 0.12 // Mock PHAN price in USD

  const usdBalance = (Number.parseFloat(balance) * seiPrice).toFixed(2)
  const phantomUsdValue = (Number.parseFloat(phantomBalance) * phantomPrice).toFixed(2)

  const assets: Asset[] = [
    {
      symbol: "SEI",
      name: "Sei Network",
      balance: balance,
      usdValue: usdBalance,
      icon: "🔷",
    },
    {
      symbol: "PHAN",
      name: "Phantom Token",
      balance: phantomBalance,
      usdValue: phantomUsdValue,
      icon: "👻",
    },
  ]

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.sei) {
        const accounts = await window.sei.connect()
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)

          // Get actual balance
          try {
            const balanceResult = await window.sei.getBalance(accounts[0])
            if (balanceResult && balanceResult.amount) {
              const seiBalance = (Number.parseFloat(balanceResult.amount) / 1000000).toFixed(6)
              setBalance(seiBalance)
            }
          } catch (error) {
            console.log("Could not fetch balance, using default")
            setBalance("0.000000")
          }
        }
      } else {
        // Fallback for testing without SEI wallet
        const mockAddress = "sei1mock" + Math.random().toString(36).substring(7)
        setAddress(mockAddress)
        setIsConnected(true)
        setBalance("0.000000")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.000000")
    setPhantomBalance("0")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        usdBalance,
        assets,
        phantomBalance,
        connectWallet,
        disconnectWallet,
        addPhanTokens,
        spendPhanTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
