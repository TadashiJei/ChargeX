'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface TransactionStatusProps {
  txHash: string;
  onComplete?: (success: boolean) => void;
}

export function TransactionStatus({ txHash, onComplete }: TransactionStatusProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    if (!txHash) return;

    const checkTransaction = async () => {
      try {
        // Only run in browser
        if (typeof window === 'undefined' || !window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const tx = await provider.getTransaction(txHash);
        
        if (!tx) return;

        // Wait for transaction to be mined
        const receipt = await tx.wait(1); // Wait for 1 confirmation
        
        if (receipt) {
          setConfirmations(1);
          setStatus(receipt.status === 1 ? 'success' : 'failed');
          
          if (onComplete) {
            onComplete(receipt.status === 1);
          }
          
          // Listen for more confirmations
          const handleConfirmation = (confirmationNumber: number) => {
            setConfirmations(confirmationNumber);
          };
          
          provider.once(tx.hash, handleConfirmation);
          
          return () => {
            provider.removeListener(tx.hash, handleConfirmation);
          };
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
        setStatus('failed');
        if (onComplete) onComplete(false);
      }
    };

    checkTransaction();
  }, [txHash, onComplete]);

  if (!txHash) return null;

  return (
    <div className="rounded-lg bg-gray-800/40 backdrop-blur-sm p-4 mt-4">
      <div className="flex items-center gap-3">
        {status === 'pending' ? (
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        ) : status === 'success' ? (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {status === 'pending' ? 'Transaction Pending' : 
               status === 'success' ? 'Transaction Successful' : 
               'Transaction Failed'}
            </span>
          </div>
          
          <div className="text-sm text-gray-400 mt-1">
            {status === 'pending' ? 'Waiting for confirmation...' : 
             status === 'success' ? `Confirmed with ${confirmations} confirmation${confirmations !== 1 ? 's' : ''}` : 
             'The transaction could not be processed'}
          </div>
          
          <div className="text-xs font-mono text-gray-500 mt-2 truncate">
            TX: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
          </div>
        </div>
      </div>
    </div>
  );
}
