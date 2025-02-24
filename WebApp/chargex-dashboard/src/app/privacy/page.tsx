"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Effects */}
      <Squares
        direction="diagonal"
        speed={0.3}
        squareSize={30}
        borderColor="rgba(247, 138, 29, 0.1)"
        hoverFillColor="rgba(247, 138, 29, 0.05)"
        className="absolute inset-0"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-gray-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-400">Last updated: February 24, 2025</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Introduction</h2>
            <p>
              At ChargeX, we take your privacy seriously. This policy describes how we collect, use, and handle your information
              when you use our decentralized battery leasing and energy trading platform.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-[#f78a1d]">Blockchain Data</h3>
              <p>
                As a decentralized platform, transactions on the ChargeX network are recorded on the blockchain and are publicly
                visible. This includes battery leasing contracts, energy trading transactions, and smart contract interactions.
              </p>

              <h3 className="text-xl font-medium text-[#f78a1d]">User Data</h3>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (wallet address, email)</li>
                <li>Battery usage and charging patterns</li>
                <li>Energy trading preferences and history</li>
                <li>Device information and IoT data</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
            <div className="space-y-4">
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate battery leasing and energy trading transactions</li>
                <li>Improve our AI analytics and predictive maintenance systems</li>
                <li>Enhance platform security and prevent fraud</li>
                <li>Communicate important updates and service information</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Data Security</h2>
            <p>
              We implement advanced security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for sensitive data</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure smart contract deployment and updates</li>
              <li>Multi-factor authentication for account access</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@chargex.io" className="text-[#f78a1d] hover:underline">
                privacy@chargex.io
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
