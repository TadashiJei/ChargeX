"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowingEffect } from "./glowing-effect";

export function BackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-8 top-8 z-50"
    >
      <Link href="/">
        <div className="relative rounded-full p-1">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-full p-2 transition-transform hover:scale-110">
            <ArrowLeft className="h-6 w-6 text-[#f78a1d]" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
