"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";

export default function TermsOfService() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-400">Last updated: February 24, 2025</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">1. Platform Overview</h2>
            <p>
              ChargeX is a decentralized Battery-as-a-Service (BaaS) platform that enables users to lease batteries,
              trade energy, and participate in the decentralized energy ecosystem. By using our platform, you agree
              to these terms and conditions.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">2. Smart Contracts</h2>
            <div className="space-y-4">
              <p>
                Our platform operates through smart contracts on the blockchain. You acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Smart contracts are immutable once deployed</li>
                <li>Transactions cannot be reversed once confirmed</li>
                <li>You are responsible for securing your private keys</li>
                <li>Smart contract interactions may incur network fees</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">3. Battery Leasing</h2>
            <div className="space-y-4">
              <p>When leasing batteries through ChargeX, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain the battery in good condition</li>
                <li>Use only approved charging stations</li>
                <li>Report any issues or damage promptly</li>
                <li>Return the battery upon lease expiration</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">4. Energy Trading</h2>
            <div className="space-y-4">
              <p>
                Energy trading on ChargeX is governed by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Market-driven pricing mechanisms</li>
                <li>Smart contract-enforced trading rules</li>
                <li>Network capacity and availability</li>
                <li>Local energy regulations</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">5. AI Analytics</h2>
            <p>
              Our platform uses AI analytics for predictive maintenance and optimization. You agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage data may be analyzed for service improvement</li>
              <li>AI predictions are advisory in nature</li>
              <li>Automated decisions may affect service delivery</li>
              <li>You can opt-out of non-essential data collection</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">6. Liability</h2>
            <p>
              ChargeX is not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Losses due to network downtime</li>
              <li>Smart contract vulnerabilities</li>
              <li>Third-party charging station issues</li>
              <li>User errors or negligence</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@chargex.io" className="text-[#f78a1d] hover:underline">
                legal@chargex.io
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
