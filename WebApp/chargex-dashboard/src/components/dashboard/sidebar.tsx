'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BatteryChargingIcon,
  LineChartIcon,
  SettingsIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  MapPinIcon,
  BrainCircuitIcon,
  HistoryIcon
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Battery Leasing', icon: BatteryChargingIcon, path: '/dashboard/battery-leasing' },
  { name: 'Battery Monitor', icon: MapPinIcon, path: '/dashboard/battery-monitor' },
  { name: 'Energy Trading', icon: LineChartIcon, path: '/dashboard/energy-trading' },
  { name: 'Predictive Analytics', icon: BrainCircuitIcon, path: '/dashboard/analytics' },
  { name: 'Transactions', icon: HistoryIcon, path: '/dashboard/transactions' },
  { name: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
  { name: 'Admin', icon: UsersIcon, path: '/dashboard/admin', adminOnly: true },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800 
                   transform lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <Image
            src="/logo-light.svg"
            alt="ChargeX Logo"
            width={150}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                              ${isActive 
                                ? 'bg-orange-500 text-white' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout button */}
          <button
            className="flex items-center px-4 py-3 mt-8 w-full text-gray-400 hover:text-white 
                     hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <LogOutIcon size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </motion.aside>
    </>
  );
}
