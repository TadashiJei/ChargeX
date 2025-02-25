"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Battery, Bolt, Brain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Hero } from "@/components/blocks/hero";
import { Squares } from "@/components/ui/squares-background";

const features = [
  {
    icon: Battery,
    title: "Battery Leasing",
    description: "Lease batteries on-demand with smart contract security",
  },
  {
    icon: Bolt,
    title: "P2P Energy Trading",
    description: "Trade excess energy in our decentralized marketplace",
  },
  {
    icon: Brain,
    title: "AI Analytics",
    description: "Smart predictive maintenance powered by Rivalz.ai",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-black">
      {/* Base Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d10_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d10_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d15_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d15_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="relative min-h-screen">

          {/* Glowing Light Overlay */}
          <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
            {/* Main glow */}
            <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-[#f78a1d]/60 opacity-80 blur-3xl" />

            {/* Lamp effect */}
            <motion.div
              initial={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "16rem" }}
              className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-[#f78a1d]/60 blur-2xl"
            />

            {/* Top line */}
            <motion.div
              initial={{ width: "15rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30rem" }}
              className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-[#f78a1d]/60"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-[#f78a1d]/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#f78a1d]/60 [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
          </div>

          <Squares 
            direction="diagonal"
            speed={0.3}
            squareSize={30}
            borderColor="rgba(247, 138, 29, 0.1)"
            hoverFillColor="rgba(247, 138, 29, 0.05)"
            className="absolute inset-0"
          />
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-4 relative z-10">
              <div className="absolute inset-0 -top-24 rounded-3xl border border-[#f78a1d30] backdrop-blur-sm bg-black/10">
                <GlowingEffect
                  spread={100}
                  glow={true}
                  disabled={false}
                  proximity={150}
                  inactiveZone={0.1}
                  borderWidth={1}
                  variant="default"
                  movementDuration={2}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f78a1d15_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d15_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
              </div>
              <div className="relative z-20 py-24 px-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-7xl font-bold text-white flex items-center justify-center gap-2"
                >
                  <span>Welcome to</span>
                  <div className="relative inline-block rounded-xl border border-[#f78a1d40] p-4 backdrop-blur-sm bg-black/20">
                    <GlowingEffect
                      spread={60}
                      glow={true}
                      disabled={false}
                      proximity={100}
                      inactiveZone={0.1}
                      borderWidth={2}
                      variant="default"
                      movementDuration={1.5}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f78a1d20_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d20_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />
                    <Image
                      src="/logo-light.svg"
                      alt="ChargeX Logo"
                      width={240}
                      height={72}
                      priority
                      className="h-auto w-auto relative z-10"
                    />
                  </div>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mt-8"
                >
                  The future of decentralized battery leasing and energy trading. Powered by blockchain technology and AI analytics.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex gap-4 justify-center mt-12"
                >
                  <Link href="/dashboard" className="block">
                    <GradientButton>Launch App</GradientButton>
                  </Link>
                  <Link href="learn" className="block">
                    <GradientButton variant="outline">Learn More</GradientButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                  className="min-h-[14rem] list-none"
                >
                  <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={3}
                    />
                    <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                      <div className="relative flex h-full flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border-[0.75px] border-white/10 bg-[#f78a1d]/10 p-3">
                          <Icon size={24} className="text-[#f78a1d]" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                            {feature.title}
                          </h3>
                          <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Core Technology Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Core Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* OCY Technology */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-4">OCY Technology</h3>
                    <p className="text-gray-300 mb-4">
                      Our proprietary Optimized Charging Yield (OCY) technology maximizes battery efficiency 
                      through smart charging algorithms and real-time monitoring.
                    </p>
                    <ul className="text-gray-400 space-y-2">
                      <li>• Smart charge scheduling</li>
                      <li>• Dynamic power distribution</li>
                      <li>• Efficiency optimization</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* ADCS System */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-4">ADCS System</h3>
                    <p className="text-gray-300 mb-4">
                      Advanced Decentralized Control System (ADCS) enables autonomous operation and 
                      seamless integration with blockchain technology.
                    </p>
                    <ul className="text-gray-400 space-y-2">
                      <li>• Decentralized control</li>
                      <li>• Smart contract integration</li>
                      <li>• Automated transactions</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* AI Agents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-4">AI Agents</h3>
                    <p className="text-gray-300 mb-4">
                      Powered by Rivalz.ai, our AI agents provide predictive maintenance, optimization, 
                      and intelligent decision-making capabilities.
                    </p>
                    <ul className="text-gray-400 space-y-2">
                      <li>• Predictive maintenance</li>
                      <li>• Performance optimization</li>
                      <li>• Usage pattern analysis</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Web3 Integration Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Web3 Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Smart Contract Flow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">Smart Contract Flow</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">1. Battery Registration</h4>
                        <p className="text-gray-400">Each battery is registered as a unique NFT with its specifications, warranty, and maintenance history on the blockchain.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">2. Leasing Contract</h4>
                        <p className="text-gray-400">Users initiate a leasing contract by depositing collateral and agreeing to pay-per-use terms through smart contracts.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">3. Usage Tracking</h4>
                        <p className="text-gray-400">Smart contracts automatically track usage metrics and calculate payments based on actual consumption.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Blockchain Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">Blockchain Features</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">NFT-Based Ownership</h4>
                        <p className="text-gray-400">Batteries are tokenized as NFTs, enabling transparent ownership tracking and seamless transfers.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Smart Payment System</h4>
                        <p className="text-gray-400">Automated micropayments using stablecoins or native tokens based on actual battery usage.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Decentralized Governance</h4>
                        <p className="text-gray-400">Community-driven decisions on platform upgrades and fee structures through DAO mechanisms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Process Flow */}
            <div className="mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="relative">
                        <div className="text-[#f78a1d] text-4xl font-bold mb-4">01</div>
                        <h4 className="text-xl font-semibold text-white mb-2">Connect Wallet</h4>
                        <p className="text-gray-400">Connect your Web3 wallet (MetaMask, etc.) to access the platform.</p>
                      </div>
                      <div className="relative">
                        <div className="text-[#f78a1d] text-4xl font-bold mb-4">02</div>
                        <h4 className="text-xl font-semibold text-white mb-2">Choose Battery</h4>
                        <p className="text-gray-400">Browse available batteries and select one that meets your needs.</p>
                      </div>
                      <div className="relative">
                        <div className="text-[#f78a1d] text-4xl font-bold mb-4">03</div>
                        <h4 className="text-xl font-semibold text-white mb-2">Sign Contract</h4>
                        <p className="text-gray-400">Review and sign the smart contract for battery leasing.</p>
                      </div>
                      <div className="relative">
                        <div className="text-[#f78a1d] text-4xl font-bold mb-4">04</div>
                        <h4 className="text-xl font-semibold text-white mb-2">Start Using</h4>
                        <p className="text-gray-400">Begin using the battery with automatic usage tracking and payments.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Technical Details */}
            <div className="mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">Technical Stack</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Smart Contracts</h4>
                        <ul className="text-gray-400 space-y-2">
                          <li>• ERC-721 for battery NFTs</li>
                          <li>• ERC-20 for payment tokens</li>
                          <li>• Custom leasing contracts</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Web3 Integration</h4>
                        <ul className="text-gray-400 space-y-2">
                          <li>• ethers.js for blockchain interaction</li>
                          <li>• IPFS for data storage</li>
                          <li>• Web3Modal for wallet connection</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Security</h4>
                        <ul className="text-gray-400 space-y-2">
                          <li>• Multi-signature wallets</li>
                          <li>• Time-locked contracts</li>
                          <li>• Audited smart contracts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* IoT Integration Section */}
        <section className="relative py-20 bg-gradient-to-b from-transparent to-black/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-16">IoT Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">Hardware Components</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">ESP32 Module</h4>
                        <p className="text-gray-400">Real-time monitoring of battery parameters including voltage, current, and temperature</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Raspberry Pi</h4>
                        <p className="text-gray-400">Central control unit managing charging processes and data processing</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Battery Management</h4>
                        <p className="text-gray-400">Advanced BMS system with NFT-based warranty tracking and health monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#f78a1d] mb-6">Smart Features</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Real-time Monitoring</h4>
                        <p className="text-gray-400">Continuous tracking of battery health, usage patterns, and charging cycles</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Predictive Maintenance</h4>
                        <p className="text-gray-400">AI-powered predictions for maintenance needs and performance optimization</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">Blockchain Integration</h4>
                        <p className="text-gray-400">Secure and transparent tracking of battery ownership and transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Technology Partners</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
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
                <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-8">
                  <div className="flex items-center justify-between flex-wrap gap-8">
                    <div className="relative w-48 h-16">
                      <Image
                        src="/partners/rivalz.png"
                        alt="Rivalz.ai"
                        fill
                        className="object-contain"
                        sizes="192px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#f78a1d] mb-2">Rivalz.ai</h3>
                      <p className="text-gray-400">
                        Powering our AI-driven predictive maintenance and analytics system for optimal battery performance and longevity.
                      </p>
                    </div>
                    <a
                      href="https://rivalz.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f78a1d] hover:text-[#f78a1d80] transition flex items-center gap-2"
                    >
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-[#f78a1d30] bg-black/20 backdrop-blur-sm">
          <Squares 
            direction="diagonal"
            speed={0.2}
            squareSize={20}
            borderColor="rgba(247, 138, 29, 0.1)"
            hoverFillColor="rgba(247, 138, 29, 0.05)"
            className="absolute inset-0"
          />
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/features" className="text-base text-gray-400 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-base text-gray-400 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/learn" className="text-base text-gray-400 hover:text-white">
                      Learn More
                    </Link>
                  </li>
                  <li>
                    <Link href="/api" className="text-base text-gray-400 hover:text-white">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/about" className="text-base text-gray-400 hover:text-white">About</Link></li>
                  <li><Link href="/blog" className="text-base text-gray-400 hover:text-white">Blog</Link></li>
                  <li><Link href="/careers" className="text-base text-gray-400 hover:text-white">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/privacy" className="text-base text-gray-400 hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="text-base text-gray-400 hover:text-white">Terms</Link></li>
                  <li><Link href="/security" className="text-base text-gray-400 hover:text-white">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#f78a1d30]">
              <p className="text-center text-gray-400 text-sm">
                {new Date().getFullYear()} ChargeX. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
