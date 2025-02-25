'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { motion } from 'framer-motion';
import { 
  Battery, 
  Bolt,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const stats = [
  {
    name: 'Total Batteries',
    value: '245',
    change: '+12.5%',
    increasing: true,
    icon: Battery,
  },
  {
    name: 'Energy Traded',
    value: '1,234 kWh',
    change: '+23.1%',
    increasing: true,
    icon: Bolt,
  },
  {
    name: 'Revenue',
    value: '$12,345',
    change: '-2.3%',
    increasing: false,
    icon: DollarSign,
  },
  {
    name: 'Active Users',
    value: '2,345',
    change: '+8.2%',
    increasing: true,
    icon: Users,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user ? user.firstName : 'User'}!
          </h1>
          <p className="text-gray-400">Here's what's happening with your batteries today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
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
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-gray-700/30 rounded-lg">
                        <Icon className="h-6 w-6 text-orange-500" />
                      </div>
                      <div className={`flex items-center ${stat.increasing ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                        {stat.increasing ? (
                          <ArrowUpRight size={20} className="ml-1" />
                        ) : (
                          <ArrowDownRight size={20} className="ml-1" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
                      <p className="text-gray-400 text-sm">{stat.name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Battery Usage Chart */}
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
              <h3 className="text-lg font-semibold text-white mb-4">Battery Usage</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Chart Component Coming Soon
              </div>
            </div>
          </div>

          {/* Energy Trading Chart */}
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
              <h3 className="text-lg font-semibold text-white mb-4">Energy Trading</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Chart Component Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
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
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {/* Activity items will go here */}
              <div className="text-gray-400 text-center py-8">
                Activity Feed Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
