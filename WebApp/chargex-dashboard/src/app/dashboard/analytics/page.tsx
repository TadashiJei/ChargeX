'use client';

import { motion } from 'framer-motion';
import { Battery, Zap, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// In a real app, this would come from your AI analytics backend
const dummyAnalytics = {
  batteryHealth: 85,
  predictedLifespan: '18 months',
  chargeCycles: 245,
  efficiencyScore: 92,
  recentPredictions: [
    {
      id: 'PRED001',
      battery: 'BAT001',
      prediction: 'Maintenance needed in 2 weeks',
      confidence: 89,
      type: 'warning',
    },
    {
      id: 'PRED002',
      battery: 'BAT002',
      prediction: 'Replace battery within 3 months',
      confidence: 95,
      type: 'alert',
    },
  ],
};

export default function PredictiveAnalyticsPage() {
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
        <h1 className="text-2xl font-semibold mb-6">Predictive Analytics</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Battery Health */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Battery className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold">{dummyAnalytics.batteryHealth}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Battery Health</h3>
          </motion.div>

          {/* Predicted Lifespan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold">{dummyAnalytics.predictedLifespan}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Predicted Lifespan</h3>
          </motion.div>

          {/* Charge Cycles */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">{dummyAnalytics.chargeCycles}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Charge Cycles</h3>
          </motion.div>

          {/* Efficiency Score */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-6 w-6 text-purple-500" />
              <span className="text-2xl font-bold">{dummyAnalytics.efficiencyScore}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Efficiency Score</h3>
          </motion.div>
        </div>

        {/* AI Predictions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative">
          <h2 className="text-xl font-semibold mb-6">AI Predictions</h2>
          <div className="space-y-4">
            {dummyAnalytics.recentPredictions.map((prediction) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 relative"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    prediction.type === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      prediction.type === 'warning' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      {prediction.battery}: {prediction.prediction}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Placeholder for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 h-[300px] flex items-center justify-center relative">
            <p className="text-gray-400">Battery Performance Trend Chart</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 h-[300px] flex items-center justify-center relative">
            <p className="text-gray-400">Maintenance Prediction Timeline</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
