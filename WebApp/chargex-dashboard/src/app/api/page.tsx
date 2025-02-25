"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";
import { Code, Database, Zap, Key, Lock, Clock } from "lucide-react";
import { useState } from "react";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/batteries",
    title: "List Batteries",
    description: "Retrieve a list of available batteries in the network",
    parameters: [
      { name: "status", type: "string", description: "Filter by battery status (available, leased, charging)" },
      { name: "location", type: "string", description: "Filter by geographic location" },
      { name: "capacity", type: "number", description: "Filter by minimum capacity (kWh)" }
    ],
    example: {
      request: 'curl -X GET "https://api.chargex.com/v1/batteries?status=available&location=sf"',
      response: `{
  "batteries": [
    {
      "id": "bat_123xyz",
      "status": "available",
      "capacity": 75.5,
      "location": "San Francisco",
      "health": 98,
      "lastCharged": "2025-02-25T07:23:15Z"
    }
  ],
  "total": 1,
  "page": 1
}`
    }
  },
  {
    method: "POST",
    path: "/api/v1/lease",
    title: "Create Lease",
    description: "Initialize a new battery lease contract",
    parameters: [
      { name: "batteryId", type: "string", description: "ID of the battery to lease", required: true },
      { name: "duration", type: "number", description: "Lease duration in hours", required: true },
      { name: "paymentMethod", type: "string", description: "Payment method ID", required: true }
    ],
    example: {
      request: 'curl -X POST "https://api.chargex.com/v1/lease" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d \'{\n    "batteryId": "bat_123xyz",\n    "duration": 24,\n    "paymentMethod": "pm_789abc"\n  }\'',
      response: `{
  "leaseId": "lease_456def",
  "status": "active",
  "startTime": "2025-02-25T15:25:13+08:00",
  "endTime": "2025-02-26T15:25:13+08:00",
  "totalCost": 45.99
}`
    }
  },
  {
    method: "GET",
    path: "/api/v1/analytics",
    title: "Usage Analytics",
    description: "Get detailed analytics about battery usage and performance",
    parameters: [
      { name: "startDate", type: "string", description: "Start date for analytics (ISO 8601)", required: true },
      { name: "endDate", type: "string", description: "End date for analytics (ISO 8601)", required: true },
      { name: "metrics", type: "array", description: "Array of metrics to include" }
    ],
    example: {
      request: 'curl -X GET "https://api.chargex.com/v1/analytics?startDate=2025-01-01&endDate=2025-02-01"',
      response: `{
  "totalUsage": 1250.45,
  "averageLeaseTime": 18.5,
  "peakDemandHours": ["08:00", "18:00"],
  "efficiency": 94.5,
  "costSavings": 325.75
}`
    }
  }
];

const features = [
  {
    icon: Database,
    title: "Real-time Data",
    description: "Access live battery status, performance metrics, and network statistics"
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description: "Quick and easy integration with our comprehensive SDK and documentation"
  },
  {
    icon: Key,
    title: "Secure Access",
    description: "Industry-standard authentication and authorization protocols"
  },
  {
    icon: Lock,
    title: "Rate Limiting",
    description: "Fair usage limits with increased quotas for enterprise plans"
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description: "Highly available API with guaranteed SLA for enterprise customers"
  },
  {
    icon: Code,
    title: "Webhooks",
    description: "Real-time event notifications for seamless integration"
  }
];

export default function ApiPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);

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
            API Documentation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Integrate with our powerful API to manage battery leases, track performance, and analyze usage data.
          </motion.p>
        </div>

        {/* API Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
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

        {/* API Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Endpoints</h2>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedEndpoint.path === endpoint.path
                        ? "bg-[#f78a1d20] text-[#f78a1d]"
                        : "text-gray-400 hover:bg-[#f78a1d10] hover:text-[#f78a1d]"
                    }`}
                  >
                    <div className="font-mono text-sm">{endpoint.method}</div>
                    <div className="text-sm truncate">{endpoint.path}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedEndpoint.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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
                  <div className="flex items-center space-x-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-mono ${
                      selectedEndpoint.method === "GET" ? "bg-green-500/20 text-green-400" :
                      selectedEndpoint.method === "POST" ? "bg-blue-500/20 text-blue-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono text-white">{selectedEndpoint.path}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedEndpoint.title}</h3>
                  <p className="text-gray-400 mb-8">{selectedEndpoint.description}</p>

                  {selectedEndpoint.parameters.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
                      <div className="space-y-4">
                        {selectedEndpoint.parameters.map((param) => (
                          <div key={param.name} className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[#f78a1d]">{param.name}</span>
                                <span className="text-sm text-gray-500">{param.type}</span>
                                {param.required && (
                                  <span className="text-xs text-red-400">required</span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{param.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Example</h4>
                    <div className="space-y-4">
                      <div className="bg-black/40 rounded-lg p-4">
                        <div className="font-mono text-sm text-gray-400">{selectedEndpoint.example.request}</div>
                      </div>
                      <div className="bg-black/40 rounded-lg p-4">
                        <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap">{selectedEndpoint.example.response}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
