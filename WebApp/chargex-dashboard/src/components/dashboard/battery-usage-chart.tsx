'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const data = [
  { time: '00:00', usage: 30 },
  { time: '04:00', usage: 25 },
  { time: '08:00', usage: 45 },
  { time: '12:00', usage: 65 },
  { time: '16:00', usage: 55 },
  { time: '20:00', usage: 40 },
  { time: '23:59', usage: 35 },
];

export function BatteryUsageChart() {
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
        <h3 className="text-lg font-semibold text-white mb-4">Battery Usage</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              unit="%"
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
            <defs>
              <linearGradient id="batteryUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#F97316"
              fill="url(#batteryUsage)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
