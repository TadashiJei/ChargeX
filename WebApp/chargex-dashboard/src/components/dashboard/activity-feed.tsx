'use client';

import { Battery, Bolt, DollarSign } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const activities = [
  {
    id: 1,
    type: 'battery',
    title: 'Battery Swap Completed',
    description: 'Successfully swapped battery #A123 at Station SG-001',
    timestamp: '2 minutes ago',
    icon: Battery,
  },
  {
    id: 2,
    type: 'energy',
    title: 'Energy Trade Executed',
    description: 'Sold 25 kWh of excess energy to the grid',
    timestamp: '15 minutes ago',
    icon: Bolt,
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment Received',
    description: 'Received $45.20 for energy trading',
    timestamp: '1 hour ago',
    icon: DollarSign,
  },
  {
    id: 4,
    type: 'battery',
    title: 'Low Battery Alert',
    description: 'Battery #B456 is at 15% charge',
    timestamp: '2 hours ago',
    icon: Battery,
  },
];

function getActivityColor(type: string) {
  switch (type) {
    case 'battery':
      return 'text-orange-500 bg-orange-500/20';
    case 'energy':
      return 'text-green-500 bg-green-500/20';
    case 'payment':
      return 'text-blue-500 bg-blue-500/20';
    default:
      return 'text-gray-500 bg-gray-500/20';
  }
}

export function ActivityFeed() {
  return (
    <div className="relative w-full">
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
      <div className="relative z-10 rounded-xl bg-gray-800/40 backdrop-blur-sm p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {activity.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
