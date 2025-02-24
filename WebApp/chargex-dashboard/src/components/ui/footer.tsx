"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GlowingEffect } from "./glowing-effect";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Battery Network", href: "/network" },
      { name: "Energy Trading", href: "/trading" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Status", href: "/status" },
      { name: "Whitepaper", href: "/whitepaper" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Security", href: "/security" },
    ],
  },
];

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/chargex" },
  { name: "Discord", href: "https://discord.gg/chargex" },
  { name: "GitHub", href: "https://github.com/chargex" },
  { name: "LinkedIn", href: "https://linkedin.com/company/chargex" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black py-12 md:py-24">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f78a1d10_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d10_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f78a1d40] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-2xl border border-[#f78a1d20] bg-black/50 p-8 backdrop-blur-xl">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={1}
          />
          
          {/* Logo and Description */}
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <Image
                src="/logo-light.svg"
                alt="ChargeX Logo"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
              <p className="mt-4 text-base text-gray-400">
                Revolutionizing battery leasing and energy trading through blockchain technology and AI analytics.
              </p>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-[#f78a1d] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-[#f78a1d] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#f78a1d20]">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} ChargeX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
