'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { GlowingEffect } from './ui/GlowingEffect';
import { MetaMaskPrompt } from './MetaMaskPrompt';

export function Web3Auth() {
  const { account, isConnecting, error, connectWallet } = useWeb3();
  const [hasMetaMask, setHasMetaMask] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    setHasMetaMask(typeof window !== 'undefined' && !!window.ethereum);
  }, []);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Show loading state while checking for MetaMask
  if (hasMetaMask === null) {
    return (
      <div className="space-y-6 p-4 relative rounded-lg bg-gray-800/40 backdrop-blur-sm">
        <div className="flex items-center justify-center py-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show MetaMask installation prompt if not installed
  if (hasMetaMask === false) {
    return <MetaMaskPrompt />;
  }

  return (
    <div className="space-y-6 p-4 relative rounded-lg bg-gray-800/40 backdrop-blur-sm">
      <GlowingEffect
        blur={20}
        disabled={false}
        glow
        className="absolute inset-0"
        variant={account ? "green" : "blue"}
        spread={60}
      />
      <div className="relative z-10">
        {account ? (
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-300 mb-1">Connected Wallet</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/90 backdrop-blur-sm"></div>
              <span className="font-mono text-sm">{formatAddress(account)}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 transition-colors"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <polyline points="12 12 19 12 19 12" />
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}
        
        {error && (
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
