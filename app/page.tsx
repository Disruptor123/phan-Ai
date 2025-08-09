"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Environment, Float, Box } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import type * as THREE from "three"
import { ArrowRight, Wallet, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSeiWallet } from "@/lib/sei-wallet"

// Canvas Animation Component for Radial Burst
function RadialBurstAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    let angle = 0
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      angle += 0.02
      const radius = 75 + Math.sin(angle) * 10

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
      ctx.lineWidth = 1

      for (let i = 0; i < 360; i += 3) {
        const radians = (i + angle * 10) * (Math.PI / 180)
        const x2 = centerX + Math.cos(radians) * radius
        const y2 = centerY + Math.sin(radians) * radius

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Canvas Animation Component for Flowing Waves
function FlowingWavesAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 300

    let time = 0
    let animationId: number

    // Initialize wave parameters
    const waves = []
    for (let i = 0; i < 20; i++) {
      waves.push({
        y: i * 15,
        offset: i * 0.1,
        amplitude: 20 + i * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
      ctx.lineWidth = 1

      // Draw flowing wave lines
      waves.forEach((wave) => {
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            wave.y +
            Math.sin(x * 0.01 + time + wave.offset) * wave.amplitude * 0.5 +
            Math.sin(x * 0.005 + time * 0.7 + wave.offset) * wave.amplitude * 0.3 +
            Math.sin(x * 0.02 + time * 1.2 + wave.offset) * wave.amplitude * 0.2

          if (x === 0) {
            ctx.moveTo(x, y + 50)
          } else {
            ctx.lineTo(x, y + 50)
          }
        }
        ctx.stroke()
      })

      // Add flowing particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"

      for (let i = 0; i < 10; i++) {
        const x = (time * 50 + i * 40) % canvas.width
        const baseY = 100 + Math.sin(time + i) * 30
        const y = baseY + Math.sin(x * 0.01 + time) * 20

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Animated blockchain nodes
function BlockchainNodes({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + scrollY * 0.001
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }

    nodesRef.current.forEach((node, i) => {
      if (node) {
        node.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5
        node.rotation.x = state.clock.elapsedTime * 0.5
        node.rotation.z = state.clock.elapsedTime * 0.3
      }
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 3
        return (
          <Float key={i} speed={1 + i * 0.1} rotationIntensity={0.5} floatIntensity={0.5}>
            <Box
              ref={(el) => el && (nodesRef.current[i] = el)}
              position={[Math.cos(angle) * radius, Math.sin(angle * 0.5) * 2, Math.sin(angle) * radius]}
              scale={0.3}
            >
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </Box>
          </Float>
        )
      })}
    </group>
  )
}

// Phantom effect particles
function PhantomParticles({ scrollY }: { scrollY: number }) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#8b5cf6" size={0.05} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Main 3D scene
function Scene({ scrollY }: { scrollY: number }) {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

      <BlockchainNodes scrollY={scrollY} />
      <PhantomParticles scrollY={scrollY} />

      <Text
        position={[0, 0, -8]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        PHANTOM LAYER
      </Text>
    </>
  )
}

// Viewport detection hook
function useInView(threshold = 0.1) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

// Sei Wallet Connection Modal
function SeiWalletConnectionModal({
  isOpen,
  onClose,
  onConnect,
}: { isOpen: boolean; onClose: () => void; onConnect: () => void }) {
  const { account, chainId, isConnected, isConnecting, connect } = useSeiWallet()

  const handleConnect = async () => {
    try {
      await connect()
      onConnect()
    } catch (error) {
      console.error("Failed to connect Sei Global Wallet:", error)
      alert("Failed to connect wallet. Please make sure Sei Global Wallet is installed.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-black border-gray-800 w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Connect Sei Global Wallet</h2>
            <p className="text-gray-400">Connect your Sei wallet to access PhanAI Dashboard</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sei Global Wallet</h3>
                  <p className="text-gray-400 text-sm">Official Sei blockchain wallet</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure blockchain integration</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Fast transaction processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Wallet className="w-4 h-4 text-red-400" />
                <span>Native Sei network support</span>
              </div>
            </div>

            {isConnected && account && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                <p className="text-green-300 text-sm font-mono">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
                <p className="text-green-300 text-xs">Chain ID: {chainId}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isConnecting ? "Connecting..." : "Connect Sei Global Wallet"}
              </Button>
            ) : (
              <Button onClick={onConnect} className="w-full bg-white text-black hover:bg-gray-100">
                Access Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PhanAILanding() {
  const [scrollY, setScrollY] = useState(0)
  const [heroRef, heroInView] = useInView(0.3)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const router = useRouter()

  const { isConnected } = useSeiWallet()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleStartBuilding = () => {
    if (isConnected) {
      router.push("/dashboard")
    } else {
      setShowWalletModal(true)
    }
  }

  const handleWalletConnect = () => {
    setShowWalletModal(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sei Wallet Connection Modal */}
      <SeiWalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Scene scrollY={scrollY} />
          </Canvas>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div
            className={`transition-all duration-1000 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="text-sm font-bold mb-4 text-white tracking-widest">PHAN AI</div>

            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-white">
              BUILDING THE AI INFRASTRUCTURE OF SEI TO BUILD PHANTOM BLOCKCHAINS
            </h2>

            <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Autonomous phantom blockchains create safe, high-fidelity testing grounds, empowering developers to build
              secure, scalable, and innovative blockchain ecosystems.
            </p>

            <Button
              onClick={handleStartBuilding}
              size="lg"
              className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* First Row - Left Card and Right Animation */}
          <div className="flex gap-8 mb-0">
            {/* Square Card 1 - Reduced image size */}
            <Card className="bg-black border-gray-800 backdrop-blur-sm w-96 h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="h-48 relative mb-4">
                  <div className="absolute inset-0 opacity-30">
                    <img
                      src="/images/radial-burst.png"
                      alt="Radial burst pattern"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="relative z-10">
                    <RadialBurstAnimation />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Phan AI is building AI-powered phantom blockchains simulated chains atop real networks to
                    stress-test, predict threats, and evolve security, ensuring blockchain ecosystems remain scalable,
                    resilient, and future-proof without risking live assets.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Side Generative Art Animation */}
            <div className="w-96 h-80">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="/images/flowing-waves.png"
                    alt="Flowing waves pattern"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative z-10">
                  <FlowingWavesAnimation />
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Rectangular Card and Right Image */}
          <div className="flex items-center gap-0 mt-8">
            {/* Rectangular Card */}
            <Card className="bg-black border-gray-800 backdrop-blur-sm w-96 h-48">
              <CardContent className="p-6 h-full flex items-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Phan AI is the operating system for autonomous AI networks creating and evolving phantom blockchains.
                </p>
              </CardContent>
            </Card>

            {/* Right Image without Animation */}
            <div className="flex-1 relative h-96 ml-8">
              <div className="absolute inset-0 opacity-60">
                <img src="/images/creation-figure.png" alt="Creation figure" className="w-full h-full object-contain" />
              </div>

              {/* Fading Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`text-center max-w-md transition-all duration-1000 ${heroInView ? "opacity-100" : "opacity-0"}`}
                >
                  <p className="text-white text-lg font-medium leading-relaxed bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                    Phan AI's mission is to build autonomous AI systems that create, test, and evolve phantom
                    blockchains, ensuring blockchain networks become more secure, scalable, and future-ready without
                    risking real-world assets or operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section - The True Onchain Agent */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            THE TRUE ONCHAIN AGENT FOR SECURITY
          </h2>

          {/* Three Large Square Cards */}
          <div className="grid grid-cols-3 gap-0">
            {/* Card 1 - Autonomous Phantom Blockchain Creation */}
            <Card className="bg-black border-gray-800 h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="h-32 mb-4 flex items-center justify-center">
                  <img
                    src="/images/cube-structure.png"
                    alt="Cube structure"
                    className="w-24 h-24 object-contain opacity-80"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Autonomous Phantom Blockchain Creation</h3>
                <div className="flex-1">
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      AI designs and launches complete simulated blockchains that mirror real networks in structure,
                      transactions, and consensus mechanisms.
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      Requires no manual setup — AI configures parameters automatically from live chain data.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Adaptive Attack Simulation */}
            <Card className="bg-black border-gray-800 h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="h-32 mb-4 flex items-center justify-center">
                  <img
                    src="/images/sphere-particles.png"
                    alt="Sphere particles"
                    className="w-24 h-24 object-contain opacity-80"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Adaptive Attack Simulation</h3>
                <div className="flex-1">
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      Uses machine learning to design and deploy evolving cyberattack patterns (e.g., reorgs, smart
                      contract exploits, DDoS).
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      AI learns from results to create stronger defense strategies.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Cross-Chain Interoperability Testing */}
            <Card className="bg-black border-gray-800 h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="h-32 mb-4 flex items-center justify-center">
                  <img
                    src="/images/burst-pattern.png"
                    alt="Burst pattern"
                    className="w-24 h-24 object-contain opacity-80"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Cross-Chain Interoperability Testing</h3>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">
                    Creates phantom versions of multiple blockchains to test bridges, multi-chain DeFi apps without
                    risking live funds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to Evolve Your Blockchain Security?</h3>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the future of blockchain testing and security with PhanAI's revolutionary phantom blockchain
            technology.
          </p>
          <Button
            onClick={handleStartBuilding}
            size="lg"
            className="bg-white hover:bg-gray-100 text-black px-12 py-6 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start Building
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>
    </div>
  )
}
