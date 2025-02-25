"use client";

import { motion } from "framer-motion";
import { Battery, Bolt, Brain, Shield, Coins, ChartBar } from "lucide-react";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";

const features = [
  {
    icon: Battery,
    title: "Smart Battery Leasing",
    description: "Lease high-performance batteries with smart contract security and real-time monitoring.",
  },
  {
    icon: Bolt,
    title: "P2P Energy Trading",
    description: "Trade excess energy in our decentralized marketplace with instant settlements.",
  },
  {
    icon: Brain,
    title: "AI Analytics",
    description: "Predictive maintenance and optimization powered by advanced machine learning.",
  },
  {
    icon: Shield,
    title: "Secure Infrastructure",
    description: "Enterprise-grade security with multi-layer encryption and blockchain verification.",
  },
  {
    icon: Coins,
    title: "Flexible Pricing",
    description: "Pay-as-you-go model with transparent pricing and no hidden fees.",
  },
  {
    icon: ChartBar,
    title: "Performance Insights",
    description: "Detailed analytics and reporting for optimizing your energy usage.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      <BackButton />
      {/* Base Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d10_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d10_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d15_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d15_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <Squares 
        direction="diagonal"
        speed={0.3}
        squareSize={30}
        borderColor="rgba(247, 138, 29, 0.1)"
        hoverFillColor="rgba(247, 138, 29, 0.05)"
        className="fixed inset-0"
      />

      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Discover how ChargeX is revolutionizing energy distribution with cutting-edge technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                    <div className="p-3 bg-[#f78a1d20] rounded-lg w-fit mb-4">
                      <Icon className="h-6 w-6 text-[#f78a1d]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
