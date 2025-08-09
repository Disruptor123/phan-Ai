import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SeiWalletProvider } from "@/lib/sei-wallet"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PhanAI - Phantom Blockchains for the Future of Security",
  description:
    "Harness AI-powered phantom blockchains to test, evolve, and fortify real blockchain networks without risking live assets.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SeiWalletProvider>{children}</SeiWalletProvider>
      </body>
    </html>
  )
}
