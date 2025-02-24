"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GradientButton } from "@/components/ui/gradient-button";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpValue = otp.join("");
    const userId = new URLSearchParams(window.location.search).get("userId");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Handle successful verification
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
        {/* OTP Container */}
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

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Enter Verification Code
            </h2>
            <p className="text-gray-400">
              We've sent a 6-digit code to your email
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-black/30 border border-[#f78a1d30] text-white focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div>
              <GradientButton
                type="submit"
                disabled={isLoading || otp.some((digit) => !digit)}
                className="w-full justify-center"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </GradientButton>
            </div>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {/* Handle resend */}}
              className="text-[#f78a1d] hover:text-[#f78a1d]/80 text-sm"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
