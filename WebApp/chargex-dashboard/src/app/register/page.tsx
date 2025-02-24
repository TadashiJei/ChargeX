"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GradientButton } from "@/components/ui/gradient-button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/styles/phone-input.css";
import countryList from "react-select-country-list";

const countryToFlag = (isoCode: string): string => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char =>
        String.fromCodePoint(char.charCodeAt(0) + 127397)
      )
    : isoCode;
};

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    region: "",
    zipCode: "",
    phoneNumber: "",
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries] = useState(() => countryList().getData());

  const validatePassword = async (password: string) => {
    try {
      const response = await fetch("/api/auth/validate-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      setPasswordStrength(data);
    } catch (err) {
      console.error("Error validating password:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Handle successful registration
      window.location.href = "/verify-email";
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

      <div className="w-full max-w-2xl relative">
        {/* Registration Container */}
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
              width={190}
              height={78}
              className="mx-auto"
            />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                required
              />
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {countryToFlag(country.value)} {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Region
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Phone Number
              </label>
              <PhoneInput
                country={formData.country.toLowerCase()}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                enableSearch={true}
                countryCodeEditable={false}
                disableSearchIcon={false}
                searchPlaceholder="Search countries"
                preferredCountries={['us', 'gb', 'ca', 'au']}
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2">
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-2 text-sm text-gray-400">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {feedback}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#f78a1d30] text-white placeholder-gray-400 focus:outline-none focus:border-[#f78a1d] focus:ring-1 focus:ring-[#f78a1d]"
                  required
                />
              </div>
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
                {isLoading ? "Creating account..." : "Create Account"}
              </GradientButton>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f78a1d] hover:text-[#f78a1d]/80">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
