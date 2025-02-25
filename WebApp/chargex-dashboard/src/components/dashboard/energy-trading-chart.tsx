'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const data = [
  { date: 'Mon', bought: 40, sold: 24 },
  { date: 'Tue', bought: 30, sold: 45 },
  { date: 'Wed', bought: 20, sold: 35 },
  { date: 'Thu', bought: 27, sold: 20 },
  { date: 'Fri', bought: 18, sold: 28 },
  { date: 'Sat', bought: 23, sold: 30 },
  { date: 'Sun', bought: 34, sold: 25 },
];

export function EnergyTradingChart() {
  return (
    <div className="relative h-[300px] w-full">
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
      <div className="relative z-10 h-full rounded-xl bg-gray-800/40 backdrop-blur-sm p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Energy Trading</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              unit=" kWh"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#F97316' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Bar dataKey="bought" name="Energy Bought" fill="#F97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" name="Energy Sold" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
