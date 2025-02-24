"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GradientButton } from "@/components/ui/gradient-button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle successful login
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Base Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d10_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d10_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d15_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d15_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="w-full max-w-md relative">
        {/* Login Container */}
        <div className="relative rounded-2xl border border-[#f78a1d30] bg-black/50 backdrop-blur-xl p-8">
          <GlowingEffect
            spread={60}
            glow={true}
            disabled={false}
            proximity={100}
            inactiveZone={0.1}
            borderWidth={1}
          />

          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo-light.svg"
              alt="ChargeX Logo"
              width={160}
              height={48}
              className="mx-auto"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <GradientButton
                type="submit"
                disabled={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </GradientButton>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-[#f78a1d] hover:text-[#f78a1d]/80"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#f78a1d] hover:text-[#f78a1d]/80"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
