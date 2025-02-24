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
                  <Link href="#features" className="block">
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
                    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/10 bg-black/20 backdrop-blur-lg p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                      <div className="relative flex flex-1 flex-col justify-between gap-3">
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
      </div>
    </div>
  );
}
