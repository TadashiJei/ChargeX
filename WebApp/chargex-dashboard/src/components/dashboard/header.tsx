'use client';

import { UserCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { NotificationPopover } from '@/components/ui/notification-popover';
import { useNotifications } from '@/contexts/notification-context';

export function Header() {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex-1" /> {/* Spacer for sidebar */}

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationPopover
            notifications={notifications}
            onNotificationsChange={(updatedNotifications) => {
              updatedNotifications.forEach(notification => {
                if (!notification.read) {
                  markAsRead(notification.id);
                }
              });
            }}
            buttonClassName="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
          />

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <UserCircleIcon size={20} />
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <span className="text-white">{user.firstName} {user.lastName}</span>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-gray-400">Connecting...</span>
                </div>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
