"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Battery, Cpu, Server, Zap, Shield, Wallet, ChartLine, Settings } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "ocy",
    title: "OCY Technology",
    icon: Battery,
    description: "Optimized Charging Yield (OCY) technology maximizes battery efficiency through smart algorithms.",
    details: [
      {
        title: "Smart Charging",
        description: "Dynamic power distribution based on real-time demand and grid conditions.",
        features: [
          "Adaptive charging rates",
          "Load balancing",
          "Peak demand management",
          "Energy efficiency optimization"
        ]
      },
      {
        title: "Yield Optimization",
        description: "Maximizing battery lifespan and performance through intelligent charging patterns.",
        features: [
          "Charge cycle optimization",
          "Temperature management",
          "Voltage regulation",
          "Capacity preservation"
        ]
      }
    ]
  },
  {
    id: "adcs",
    title: "ADCS System",
    icon: Server,
    description: "Advanced Decentralized Control System for autonomous operation and blockchain integration.",
    details: [
      {
        title: "Decentralized Control",
        description: "Autonomous operation through distributed control mechanisms.",
        features: [
          "Peer-to-peer communication",
          "Consensus mechanisms",
          "Fault tolerance",
          "Self-healing capabilities"
        ]
      },
      {
        title: "Blockchain Integration",
        description: "Seamless integration with blockchain for transparent and secure operations.",
        features: [
          "Smart contract automation",
          "Transaction verification",
          "Data immutability",
          "Decentralized storage"
        ]
      }
    ]
  },
  {
    id: "ai",
    title: "AI Integration",
    icon: ChartLine,
    description: "Rivalz.ai powered predictive maintenance and optimization system.",
    details: [
      {
        title: "Predictive Maintenance",
        description: "AI-driven system for predicting and preventing battery issues.",
        features: [
          "Failure prediction",
          "Maintenance scheduling",
          "Performance analysis",
          "Health monitoring"
        ]
      },
      {
        title: "Optimization Engine",
        description: "Advanced algorithms for optimizing battery usage and efficiency.",
        features: [
          "Usage pattern analysis",
          "Energy optimization",
          "Cost reduction",
          "Performance tuning"
        ]
      }
    ]
  },
  {
    id: "web3",
    title: "Web3 Integration",
    icon: Wallet,
    description: "Blockchain-based system for transparent and secure battery management.",
    details: [
      {
        title: "Smart Contracts",
        description: "Automated contract management for battery leasing and transactions.",
        features: [
          "ERC-721 NFT tokens",
          "ERC-20 payment tokens",
          "Automated payments",
          "Usage tracking"
        ]
      },
      {
        title: "Decentralized Features",
        description: "Advanced blockchain features for platform governance and security.",
        features: [
          "DAO governance",
          "Token economics",
          "Multi-sig security",
          "IPFS storage"
        ]
      }
    ]
  },
  {
    id: "iot",
    title: "IoT Hardware",
    icon: Cpu,
    description: "Advanced hardware integration for real-time monitoring and control.",
    details: [
      {
        title: "Hardware Components",
        description: "Integrated hardware system for comprehensive battery management.",
        features: [
          "ESP32 monitoring",
          "Raspberry Pi control",
          "BMS integration",
          "Sensor networks"
        ]
      },
      {
        title: "Data Management",
        description: "Real-time data collection and processing system.",
        features: [
          "Real-time monitoring",
          "Data analytics",
          "Edge computing",
          "Cloud integration"
        ]
      }
    ]
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Multi-layered security system for platform and user protection.",
    details: [
      {
        title: "Platform Security",
        description: "Comprehensive security measures for platform protection.",
        features: [
          "Smart contract audits",
          "Multi-sig wallets",
          "Time-locked contracts",
          "Access control"
        ]
      },
      {
        title: "Data Protection",
        description: "Advanced systems for protecting user data and transactions.",
        features: [
          "Encryption",
          "Privacy preservation",
          "Secure storage",
          "Access management"
        ]
      }
    ]
  }
];

export default function LearnMore() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-black/95 to-[#f78a1d]/5">
      <div className="relative">
        <div className="fixed inset-0">
          <Squares 
            direction="diagonal"
            speed={0.3}
            squareSize={30}
            borderColor="rgba(247, 138, 29, 0.1)"
            hoverFillColor="rgba(247, 138, 29, 0.05)"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <BackButton />
          
          {/* Header */}
          <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-white mb-6"
            >
              Learn More About ChargeX
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              Discover how our innovative technology is revolutionizing battery management through
              decentralized control, AI optimization, and blockchain integration.
            </motion.p>
          </div>

          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={`#${section.id}`}
                    className="px-6 py-3 rounded-full border border-[#f78a1d30] bg-black/40 backdrop-blur-sm
                      text-[#f78a1d] hover:bg-[#f78a1d20] transition duration-300 flex items-center gap-2"
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-32">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="scroll-mt-20"
              >
                <div className="relative rounded-[1.25rem] border-[0.75px] border-[#f78a1d30] p-2 md:rounded-[1.5rem] md:p-3">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-[#f78a1d20] flex items-center justify-center border border-[#f78a1d30]">
                        <section.icon className="w-6 h-6 text-[#f78a1d]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                        <p className="text-gray-400 mt-1">{section.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {section.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="space-y-4">
                          <h3 className="text-2xl font-semibold text-[#f78a1d]">{detail.title}</h3>
                          <p className="text-gray-300">{detail.description}</p>
                          <ul className="space-y-2">
                            {detail.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="text-gray-400 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#f78a1d]" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-32 text-center"
          >
            <div className="relative rounded-[1.25rem] border-[0.75px] border-[#f78a1d30] p-2 md:rounded-[1.5rem] md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join the future of decentralized battery management. Start using ChargeX today
                  and experience the power of blockchain-enabled battery leasing.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#f78a1d] text-black
                    font-semibold hover:bg-[#f78a1d90] transition duration-300"
                >
                  View Pricing
                  <Zap className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
