'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpDown, Filter, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// In a real app, this would come from your backend
const dummyTransactions = [
  {
    id: 'TRX001',
    type: 'Battery Lease',
    amount: 50.00,
    status: 'Completed',
    date: new Date('2024-02-25T14:30:00'),
    batteryId: 'BAT001',
  },
  {
    id: 'TRX002',
    type: 'Energy Trading',
    amount: 25.50,
    status: 'Pending',
    date: new Date('2024-02-25T10:15:00'),
    batteryId: 'BAT002',
  },
  {
    id: 'TRX003',
    type: 'Maintenance',
    amount: 35.00,
    status: 'Completed',
    date: new Date('2024-02-24T16:45:00'),
    batteryId: 'BAT001',
  },
];

export default function TransactionsPage() {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

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
        <h1 className="text-2xl font-semibold mb-6">Transactions</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold">$110.50</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center space-x-4">
              <ArrowUpDown className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400">Active Leases</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 relative"
          >
            <div className="flex items-center space-x-4">
              <Filter className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-400">Pending Transactions</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden relative">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Transactions</h2>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Battery ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dummyTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="text-sm"
                  >
                    <td className="p-4 font-medium">{transaction.id}</td>
                    <td className="p-4">{transaction.type}</td>
                    <td className="p-4">${transaction.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Completed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-4">{transaction.date.toLocaleString()}</td>
                    <td className="p-4">{transaction.batteryId}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
