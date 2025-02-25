'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Battery, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// In a real app, this would come from your backend
const dummyBatteries = [
  {
    id: 'BAT001',
    location: { lat: 1.3521, lng: 103.8198 },
    status: 'Active',
    charge: 85,
    temperature: 25,
    lastUpdate: new Date(),
  },
  {
    id: 'BAT002',
    location: { lat: 1.3423, lng: 103.8353 },
    status: 'Warning',
    charge: 15,
    temperature: 35,
    lastUpdate: new Date(),
  },
];

export default function BatteryTrackingPage() {
  const [selectedBattery, setSelectedBattery] = useState(dummyBatteries[0]);

  return (
    <DashboardLayout>
      <div className="p-6 relative">
        <GlowingEffect
          blur={20}
          disabled={false}
          glow
          className="absolute inset-0"
          variant="white"
          spread={80}
        />
        <h1 className="text-2xl font-semibold mb-6">Battery Tracking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Battery List */}
          <div className="lg:col-span-1 space-y-4">
            {dummyBatteries.map((battery) => (
              <motion.div
                key={battery.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl cursor-pointer transition-colors relative backdrop-blur-sm ${
                  selectedBattery.id === battery.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedBattery(battery)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Battery className="h-5 w-5" />
                    <span className="font-medium">{battery.id}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      battery.status === 'Active'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}
                  >
                    {battery.status}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Charge</span>
                    <span>{battery.charge}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Temperature</span>
                    <span>{battery.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Last Update</span>
                    <span>{battery.lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 h-[500px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p>Map integration coming soon!</p>
                <p className="text-sm mt-2">
                  Will integrate with Google Maps/Mapbox for real-time tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              <span>Battery BAT002 is running low (15% charge remaining)</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
