"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { useState } from "react";
import { Calendar, Code, Server, Zap, Cpu, Link } from "lucide-react";

const teamMembers = [
  {
    name: "Andrea Faith Alimorong",
    role: "Cloud Engineer",
    image: "/team/andrea.jpg",
    description: "Specializing in cloud infrastructure and distributed systems",
  },
  {
    name: "Java Jay Bartolome",
    role: "Software Engineer",
    image: "/team/jay.jpg",
    description: "Full-stack developer with expertise in blockchain technology",
  },
];

const timeline = [
  {
    date: "January 15-24, 2025",
    title: "Research & Planning",
    description: "Gathered information about battery technology, blockchain integration, and market analysis",
    icon: Calendar,
  },
  {
    date: "January 25, 2025",
    title: "Project Inception",
    description: "Started development of ChargeX platform with focus on decentralized battery leasing",
    icon: Code,
  },
  {
    date: "February 1, 2025",
    title: "Smart Contract Development",
    description: "Implemented core smart contracts for battery leasing and P2P energy trading",
    icon: Server,
  },
  {
    date: "February 8, 2025",
    title: "Hardware Integration",
    description: "Integrated ESP32 and Raspberry Pi modules for battery monitoring",
    icon: Cpu,
  },
  {
    date: "February 15, 2025",
    title: "Rivalz.ai Partnership",
    description: "Integrated Rivalz.ai for AI-powered predictive maintenance and analytics",
    icon: Link,
  },
  {
    date: "February 20, 2025",
    title: "Platform Launch",
    description: "Successfully launched the ChargeX platform with full feature set",
    icon: Zap,
  },
  {
    date: "February 25-March 7, 2025",
    title: "Preparation Phase",
    description: "Fine-tuning the platform and preparing pitch materials",
    icon: Code,
  },
  {
    date: "March 8, 2025",
    title: "Pitching Day",
    description: "Presenting ChargeX to potential investors and partners",
    icon: Calendar,
  },
];

const partners = [
  {
    name: "Rivalz.ai",
    logo: "/partners/rivalz.png",
    description: "AI-powered predictive analytics and maintenance partner",
    link: "https://rivalz.ai"
  },
];

const milestones = [
  {
    year: "January 2025",
    title: "Project Kickoff",
    description: "Started the development of ChargeX with comprehensive research and planning",
  },
  {
    year: "February 2025",
    title: "Platform Development",
    description: "Built and launched the core platform with Rivalz.ai partnership",
  },
  {
    year: "March 2025",
    title: "Investment Phase",
    description: "Preparing for pitching day to secure funding and partnerships",
  },
];

export default function AboutPage() {
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
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            About ChargeX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            We're revolutionizing energy distribution through decentralized solutions and cutting-edge technology.
          </motion.p>
        </div>

        {/* Mission Section */}
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
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                At ChargeX, we envision a future where energy is democratized, sustainable, and accessible to all. 
                Through our innovative battery leasing platform and P2P energy trading marketplace, we're building 
                the infrastructure for the next generation of energy distribution.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
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
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="mb-6 relative mx-auto w-48 h-48 rounded-full overflow-hidden bg-[#f78a1d10]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 192px, 192px"
                        priority
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                    <p className="text-[#f78a1d] text-lg mb-3">{member.role}</p>
                    <p className="text-gray-400">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Development Timeline</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-[#f78a1d30]" />
            <div className="space-y-12">
              {timeline.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                      <div className="relative">
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
                            <span className="text-[#f78a1d] text-sm">{event.date}</span>
                            <h3 className="text-xl font-semibold text-white mt-2 mb-3">{event.title}</h3>
                            <p className="text-gray-400">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#f78a1d20] border-2 border-[#f78a1d]">
                      <Icon className="w-6 h-6 text-[#f78a1d]" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Partners</h2>
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
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
                    <div className="flex items-center justify-between">
                      <div className="relative w-48 h-16">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain"
                          sizes="192px"
                        />
                      </div>
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f78a1d] hover:text-[#f78a1d80] transition"
                      >
                        Visit Website →
                      </a>
                    </div>
                    <p className="text-gray-400 mt-4">{partner.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestones Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
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
                    <div className="text-[#f78a1d] text-2xl font-bold mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
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
