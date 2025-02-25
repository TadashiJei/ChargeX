"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";
import { Shield, Lock, Key, Eye, Server, Bell } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit and at rest using industry-standard encryption protocols.",
  },
  {
    icon: Lock,
    title: "Multi-Factor Authentication",
    description: "Additional security layer with SMS, email, or authenticator app verification.",
  },
  {
    icon: Key,
    title: "Smart Contract Security",
    description: "Regularly audited smart contracts with automated vulnerability scanning.",
  },
  {
    icon: Eye,
    title: "24/7 Monitoring",
    description: "Continuous monitoring of all systems with automated threat detection.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Enterprise-grade cloud infrastructure with multiple redundancy layers.",
  },
  {
    icon: Bell,
    title: "Security Alerts",
    description: "Real-time notifications for any suspicious activity on your account.",
  },
];

const certifications = [
  "ISO 27001 Certified",
  "SOC 2 Type II Compliant",
  "GDPR Compliant",
  "CCPA Compliant",
  "PCI DSS Certified",
  "NIST Framework Aligned",
];

export default function SecurityPage() {
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
            Security at ChargeX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Your security is our top priority. Learn about our comprehensive approach to protecting your data and assets.
          </motion.p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {securityFeatures.map((feature, index) => {
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

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
              <h2 className="text-2xl font-bold text-white mb-6">Certifications & Compliance</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#f78a1d] rounded-full" />
                    <span className="text-gray-300">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Security Issue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Report a Security Issue</h2>
          <p className="text-gray-400 mb-2">
            If you believe you've found a security vulnerability, please report it to:
          </p>
          <a
            href="mailto:security@chargex.com"
            className="text-[#f78a1d] hover:text-[#f78a1d]/80 transition"
          >
            security@chargex.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
