'use client';

import { BellIcon, UserCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex-1" /> {/* Spacer for sidebar */}

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 relative"
          >
            <BellIcon size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </motion.button>

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <UserCircleIcon size={20} />
            <span className="hidden sm:inline">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
