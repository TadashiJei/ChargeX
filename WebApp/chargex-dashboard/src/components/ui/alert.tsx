'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const alertStyles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    icon: Check,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    icon: X,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export function Alert({
  type,
  title,
  message,
  isOpen,
  onClose,
  duration = 3000,
}: AlertProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div
            className={`${style.bg} border ${style.border} rounded-xl shadow-lg backdrop-blur-sm max-w-md
              animate-glow`}
            style={{
              boxShadow: `0 0 20px 0 ${type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 
                type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                type === 'warning' ? 'rgba(234, 179, 8, 0.2)' : 
                'rgba(59, 130, 246, 0.2)'}`,
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <div className={`${style.iconColor} p-1`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium">{title}</h3>
                {message && (
                  <p className="text-gray-300 text-sm mt-1">{message}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
