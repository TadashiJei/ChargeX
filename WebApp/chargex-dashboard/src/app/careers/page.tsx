"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GradientButton } from "@/components/ui/gradient-button";
import { BackButton } from "@/components/ui/back-button";
import { MapPin, Clock, Users } from "lucide-react";

const positions = [
  {
    title: "Senior Blockchain Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "5+ years",
    description: "Join our core team to build the next generation of decentralized energy trading platforms.",
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Help develop our predictive maintenance and optimization algorithms.",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    experience: "4+ years",
    description: "Lead the development of our battery leasing platform and marketplace features.",
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Create beautiful and intuitive interfaces for our web and mobile applications.",
  },
  {
    title: "Energy Markets Analyst",
    department: "Business",
    location: "London, UK",
    type: "Full-time",
    experience: "2+ years",
    description: "Analyze energy markets and help shape our trading strategies.",
  },
  {
    title: "Customer Success Manager",
    department: "Operations",
    location: "Singapore",
    type: "Full-time",
    experience: "3+ years",
    description: "Help our enterprise customers succeed with ChargeX solutions.",
  },
];

const benefits = [
  "Competitive salary and equity",
  "Health, dental, and vision insurance",
  "Flexible work arrangements",
  "Professional development budget",
  "Regular team events and retreats",
  "Home office setup allowance",
];

export default function CareersPage() {
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
            Join Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Help us build the future of energy distribution. We're looking for passionate individuals to join our mission.
          </motion.p>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mb-20"
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
              <h2 className="text-2xl font-bold text-white mb-6">Benefits & Perks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#f78a1d] rounded-full" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
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
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2">{position.title}</h3>
                      <p className="text-[#f78a1d]">{position.department}</p>
                    </div>
                    <p className="text-gray-300 mb-6">{position.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{position.experience}</span>
                      </div>
                    </div>
                    <GradientButton className="w-full">Apply Now</GradientButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
