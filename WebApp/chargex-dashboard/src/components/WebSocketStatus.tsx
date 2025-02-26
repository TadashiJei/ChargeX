'use client';

import { useState, useEffect } from 'react';
import { websocketService } from '@/services/websocket-service';
import { GlowingEffect } from './ui/GlowingEffect';

export function WebSocketStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    websocketService.connect();

    // Listen for connection status changes
    const handleConnect = () => {
      setStatus('connected');
    };

    const handleDisconnect = () => {
      setStatus('disconnected');
    };

    const handleMessage = (message: any) => {
      setLastMessage(JSON.stringify(message));
    };

    websocketService.addListener('connect', handleConnect);
    websocketService.addListener('disconnect', handleDisconnect);
    websocketService.addListener('message', handleMessage);

    // Check initial connection status
    if (websocketService.isConnected()) {
      setStatus('connected');
    } else {
      setStatus('connecting');
    }

    // Cleanup
    return () => {
      websocketService.removeListener('connect', handleConnect);
      websocketService.removeListener('disconnect', handleDisconnect);
      websocketService.removeListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="space-y-6 p-4 relative rounded-lg bg-gray-800/40 backdrop-blur-sm">
      <GlowingEffect
        blur={20}
        disabled={false}
        glow
        className="absolute inset-0"
        variant={status === 'connected' ? 'green' : status === 'connecting' ? 'yellow' : 'red'}
        spread={60}
      />
      <div className="flex items-center space-x-2 mb-2 relative z-10">
        <div 
          className={`w-3 h-3 rounded-full ${
            status === 'connected' ? 'bg-green-500/90 backdrop-blur-sm' : 
            status === 'connecting' ? 'bg-yellow-500/90 backdrop-blur-sm' : 
            'bg-red-500/90 backdrop-blur-sm'
          }`}
        />
        <h3 className="text-sm font-medium">
          WebSocket: {status}
        </h3>
      </div>
      
      {lastMessage && (
        <div className="mt-2 relative z-10">
          <p className="text-xs text-gray-400">Last message:</p>
          <div className="mt-1 p-2 bg-gray-700/50 backdrop-blur-sm rounded text-xs font-mono overflow-x-auto max-h-20 overflow-y-auto">
            {lastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
