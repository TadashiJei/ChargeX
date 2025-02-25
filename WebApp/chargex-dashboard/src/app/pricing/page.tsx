"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GradientButton } from "@/components/ui/gradient-button";
import { BackButton } from "@/components/ui/back-button";

const plans = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 5 battery leases",
      "Basic energy trading",
      "Standard analytics",
      "Email support",
      "API access",
    ],
  },
  {
    name: "Professional",
    price: "99",
    description: "Ideal for growing businesses",
    features: [
      "Up to 20 battery leases",
      "Advanced energy trading",
      "Real-time analytics",
      "Priority support",
      "Advanced API access",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited battery leases",
      "Premium energy trading",
      "AI-powered analytics",
      "24/7 dedicated support",
      "Full API access",
      "Custom development",
      "SLA guarantee",
    ],
  },
];

export default function PricingPage() {
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
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Choose the plan that best fits your needs. All plans include basic features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
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
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f78a1d] text-black text-sm font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-white mb-2">
                      {plan.price === "Custom" ? (
                        "Custom"
                      ) : (
                        <>
                          <span className="text-2xl">$</span>
                          {plan.price}
                          <span className="text-xl text-gray-400">/mo</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-300">
                        <Check className="h-5 w-5 text-[#f78a1d] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <GradientButton className="w-full">
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
