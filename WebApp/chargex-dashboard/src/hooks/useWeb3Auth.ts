'use client';

import { useState, useEffect, useCallback } from 'react';
import web3Service from '@/services/web3-service-v6';

interface UseWeb3AuthReturn {
  account: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

export function useWeb3Auth(): UseWeb3AuthReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const currentAccount = await web3Service.getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      const handleDisconnect = () => {
        setAccount(null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        // Clean up listeners
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await web3Service.connectWallet();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    account,
    isConnecting,
    error,
    connectWallet,
    isConnected: !!account
  };
}
