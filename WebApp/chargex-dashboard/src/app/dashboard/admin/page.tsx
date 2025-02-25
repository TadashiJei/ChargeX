'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useState } from 'react';
import { useNotifications } from '@/contexts/notification-context';
import { 
  Users,
  Battery,
  Activity,
  AlertTriangle,
  MoreVertical,
  Search,
  Filter,
  Download
} from 'lucide-react';

const users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'User',
    status: 'Active',
    lastActive: '2 hours ago',
    batteryCount: 3
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'Admin',
    status: 'Active',
    lastActive: '5 minutes ago',
    batteryCount: 5
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'User',
    status: 'Inactive',
    lastActive: '2 days ago',
    batteryCount: 1
  },
];

const systemStats = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+12%',
    icon: Users,
    trend: 'up'
  },
  {
    title: 'Active Batteries',
    value: '456',
    change: '+8%',
    icon: Battery,
    trend: 'up'
  },
  {
    title: 'System Health',
    value: '98%',
    change: '-1%',
    icon: Activity,
    trend: 'down'
  },
  {
    title: 'Active Alerts',
    value: '3',
    change: '+2',
    icon: AlertTriangle,
    trend: 'up'
  }
];

const alerts = [
  {
    id: 1,
    type: 'warning',
    message: 'Battery #245 health below 80%',
    time: '10 minutes ago'
  },
  {
    id: 2,
    type: 'error',
    message: 'Failed authentication attempts detected',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'info',
    message: 'System maintenance scheduled',
    time: '2 hours ago'
  }
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { addNotification } = useNotifications();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and monitor system health</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat) => {
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
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
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

        {/* User Management */}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">User Management</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-600/70">
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-600/70">
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Last Active</th>
                    <th className="pb-3 font-medium">Batteries</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-4">
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'Admin' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">{user.lastActive}</td>
                      <td className="py-4 text-gray-400">{user.batteryCount}</td>
                      <td className="py-4">
                        <button 
                          className="p-2 hover:bg-gray-700/50 backdrop-blur-sm rounded-lg transition-colors"
                          onClick={() => {
                            addNotification(
                              'User Action',
                              `Viewing details for ${user.name}`
                            );
                          }}
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Alerts */}
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
            <h2 className="text-xl font-semibold text-white mb-4">System Alerts</h2>
            
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg ${
                    alert.type === 'warning' ? 'bg-yellow-500/20 border-l-4 border-yellow-500' :
                    alert.type === 'error' ? 'bg-red-500/20 border-l-4 border-red-500' :
                    'bg-blue-500/20 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white">{alert.message}</p>
                      <p className="text-sm text-gray-400">{alert.time}</p>
                    </div>
                    <button 
                      className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => {
                        addNotification(
                          'Alert Action',
                          `Viewing details for alert: ${alert.message}`
                        );
                      }}
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
