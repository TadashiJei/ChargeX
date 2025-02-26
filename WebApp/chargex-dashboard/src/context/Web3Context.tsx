'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

interface Web3ContextType {
  account: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const web3Auth = useWeb3Auth();

  return (
    <Web3Context.Provider value={web3Auth}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
