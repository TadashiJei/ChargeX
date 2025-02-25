'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Battery, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface BatteryItem {
  id: string;
  status: 'available' | 'in-use' | 'maintenance';
  chargeLevel: number;
  location: string;
  lastSwapped: string;
  healthScore: number;
}

const batteries: BatteryItem[] = [
  {
    id: 'BAT-001',
    status: 'available',
    chargeLevel: 95,
    location: 'Station SG-001',
    lastSwapped: '2 hours ago',
    healthScore: 98,
  },
  {
    id: 'BAT-002',
    status: 'in-use',
    chargeLevel: 45,
    location: 'Vehicle EV-123',
    lastSwapped: '8 hours ago',
    healthScore: 95,
  },
  {
    id: 'BAT-003',
    status: 'maintenance',
    chargeLevel: 0,
    location: 'Service Center',
    lastSwapped: '3 days ago',
    healthScore: 82,
  },
  // Add more batteries as needed
];

function getBatteryStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'text-green-500 bg-green-500/20';
    case 'in-use':
      return 'text-orange-500 bg-orange-500/20';
    case 'maintenance':
      return 'text-red-500 bg-red-500/20';
    default:
      return 'text-gray-500 bg-gray-500/20';
  }
}

function getHealthScoreColor(score: number) {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-red-500';
}

export default function BatteryLeasePage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredBatteries = selectedStatus === 'all'
    ? batteries
    : batteries.filter(battery => battery.status === selectedStatus);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 relative">
        <GlowingEffect
          blur={20}
          disabled={false}
          glow
          className="absolute inset-0"
          variant="white"
          spread={80}
        />
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Battery Lease Management</h1>
          <p className="text-gray-400">Monitor and manage your battery fleet</p>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-4">
          {['all', 'available', 'in-use', 'maintenance'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg backdrop-blur-sm relative ${
                selectedStatus === status
                  ? 'bg-orange-500/90 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Battery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatteries.map((battery) => (
            <motion.div
              key={battery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative"
            >
              <div className="relative rounded-xl">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 relative z-10">
                  {/* Battery Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getBatteryStatusColor(battery.status)}`}>
                        <Battery className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{battery.id}</h3>
                    </div>
                    <span className={`text-sm font-medium capitalize ${getBatteryStatusColor(battery.status)}`}>
                      {battery.status}
                    </span>
                  </div>

                  {/* Battery Details */}
                  <div className="space-y-4">
                    {/* Charge Level */}
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Charge Level</span>
                        <span className="text-sm font-medium text-white">{battery.chargeLevel}%</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                        <div
                          style={{ width: `${battery.chargeLevel}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{battery.location}</span>
                    </div>

                    {/* Last Swapped */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Last swapped {battery.lastSwapped}</span>
                    </div>

                    {/* Health Score */}
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">
                        Health Score: <span className={getHealthScoreColor(battery.healthScore)}>{battery.healthScore}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      View Details
                    </motion.button>
                    {battery.status === 'available' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Lease Battery
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
