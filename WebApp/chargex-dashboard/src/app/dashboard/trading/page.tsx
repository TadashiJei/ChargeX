'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Battery, 
  Bolt,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const energyData = [
  { time: '00:00', price: 0.12, demand: 75 },
  { time: '04:00', price: 0.14, demand: 60 },
  { time: '08:00', price: 0.18, demand: 85 },
  { time: '12:00', price: 0.22, demand: 95 },
  { time: '16:00', price: 0.20, demand: 90 },
  { time: '20:00', price: 0.16, demand: 80 },
  { time: '23:59', price: 0.13, demand: 70 },
];

const recentTrades = [
  {
    id: 1,
    type: 'sell',
    amount: '25 kWh',
    price: '$0.18/kWh',
    total: '$4.50',
    time: '5 minutes ago',
    status: 'completed'
  },
  {
    id: 2,
    type: 'buy',
    amount: '15 kWh',
    price: '$0.15/kWh',
    total: '$2.25',
    time: '15 minutes ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'sell',
    amount: '40 kWh',
    price: '$0.20/kWh',
    total: '$8.00',
    time: '1 hour ago',
    status: 'completed'
  },
];

export default function EnergyTradingPage() {
  const [selectedTab, setSelectedTab] = useState<'market' | 'trades'>('market');

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
          <h1 className="text-2xl font-bold text-white">Energy Trading</h1>
          <p className="text-gray-400">Buy and sell energy on the ChargeX network</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Current Price',
              value: '$0.18/kWh',
              change: '+5.2%',
              increasing: true,
              icon: DollarSign,
            },
            {
              title: 'Available Energy',
              value: '125 kWh',
              change: '-2.5%',
              increasing: false,
              icon: Battery,
            },
            {
              title: 'Network Demand',
              value: '1,234 kWh',
              change: '+8.3%',
              increasing: true,
              icon: Bolt,
            },
            {
              title: '24h Volume',
              value: '$12,345',
              change: '+15.4%',
              increasing: true,
              icon: TrendingUp,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4">
          <motion.button
            onClick={() => setSelectedTab('market')}
            className={`px-4 py-2 rounded-lg backdrop-blur-sm relative ${
              selectedTab === 'market'
                ? 'bg-orange-500/90 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Market Overview
          </motion.button>
          <motion.button
            onClick={() => setSelectedTab('trades')}
            className={`px-4 py-2 rounded-lg backdrop-blur-sm relative ${
              selectedTab === 'trades'
                ? 'bg-orange-500/90 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Recent Trades
          </motion.button>
        </div>

        {selectedTab === 'market' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Chart */}
            <div className="relative h-[400px]">
              <div className="absolute inset-0">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
              </div>
              <div className="relative z-10 h-full rounded-xl bg-gray-800/40 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Price Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#F97316"
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Demand Chart */}
            <div className="relative h-[400px]">
              <div className="absolute inset-0">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
              </div>
              <div className="relative z-10 h-full rounded-xl bg-gray-800/40 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Network Demand</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="demand" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* Recent Trades */
          <div className="relative">
            <div className="absolute inset-0">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
              />
            </div>
            <div className="relative z-10 rounded-xl bg-gray-800/40 backdrop-blur-sm p-6">
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        trade.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                      }`}>
                        {trade.type === 'buy' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{trade.type}</p>
                        <p className="text-sm text-gray-400">{trade.amount} @ {trade.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{trade.total}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {trade.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trade Actions */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Buy Energy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Sell Energy
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
