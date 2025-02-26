'use client';

import { useState, useEffect } from 'react';
import web3Service from '@/services/web3-service-v6';
import { GlowingEffect } from '@/components/ui/GlowingEffect';

interface Battery {
  _id: string;
  serialNumber: string;
  manufacturer: string;
  capacity: number;
  chargeLevel: number;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: string;
  dailyRate: number;
  isAvailable: boolean;
}

interface Lease {
  _id: string;
  batteryId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  battery?: Battery;
}

const BatteryLeasing = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [leaseDuration, setLeaseDuration] = useState(7); // Default 7 days
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [transactionPending, setTransactionPending] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      const accounts = await web3Service.connectWallet();
      setAccount(accounts[0]);
      setWalletConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet. Make sure MetaMask is installed and unlocked.');
    }
  };

  // Fetch available batteries
  const fetchBatteries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/batteries');
      
      if (!response.ok) {
        throw new Error('Failed to fetch batteries');
      }
      
      const data = await response.json();
      setBatteries(data.batteries);
    } catch (error) {
      console.error('Error fetching batteries:', error);
      setError('Failed to load batteries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's leases
  const fetchLeases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leases');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leases');
      }
      
      const data = await response.json();
      setLeases(data.leases);
    } catch (error) {
      console.error('Error fetching leases:', error);
      setError('Failed to load leases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new lease
  const createLease = async () => {
    if (!selectedBattery) return;
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, create the lease on the blockchain
      const { leaseId, txHash } = await web3Service.createLease(
        selectedBattery._id,
        leaseDuration
      );
      
      // Then, create the lease in our database
      const response = await fetch('/api/leases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batteryId: selectedBattery._id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + leaseDuration * 86400000).toISOString(),
          totalAmount: selectedBattery.dailyRate * leaseDuration,
          status: 'active',
          blockchainLeaseId: leaseId,
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create lease');
      }
      
      // Refresh leases
      await fetchLeases();
      
      // Reset selection
      setSelectedBattery(null);
      setLeaseDuration(7);
      
      alert('Lease created successfully!');
    } catch (error) {
      console.error('Error creating lease:', error);
      setError('Failed to create lease. Please try again.');
    } finally {
      setTransactionPending(false);
    }
  };

  // Complete a lease
  const completeLease = async (leaseId: string, blockchainLeaseId: string) => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, complete the lease on the blockchain
      const txHash = await web3Service.completeLease(blockchainLeaseId);
      
      // Then, update the lease in our database
      const response = await fetch(`/api/leases/${leaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete lease');
      }
      
      // Refresh leases
      await fetchLeases();
      
      alert('Lease completed successfully!');
    } catch (error) {
      console.error('Error completing lease:', error);
      setError('Failed to complete lease. Please try again.');
    } finally {
      setTransactionPending(false);
    }
  };

  // Cancel a lease
  const cancelLease = async (leaseId: string, blockchainLeaseId: string) => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, cancel the lease on the blockchain
      const txHash = await web3Service.cancelLease(blockchainLeaseId);
      
      // Then, update the lease in our database
      const response = await fetch(`/api/leases/${leaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel lease');
      }
      
      // Refresh leases
      await fetchLeases();
      
      alert('Lease cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling lease:', error);
      setError('Failed to cancel lease. Please try again.');
    } finally {
      setTransactionPending(false);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      const account = await web3Service.getCurrentAccount();
      if (account) {
        setAccount(account);
        setWalletConnected(true);
      }
    };
    
    checkWalletConnection();
  }, []);

  // Load batteries and leases on mount
  useEffect(() => {
    fetchBatteries();
    fetchLeases();
  }, []);

  return (
    <div className="space-y-6 p-6 relative">
      <GlowingEffect
        blur={20}
        disabled={false}
        glow
        className="absolute inset-0"
        variant="white"
        spread={80}
      />
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-6">Battery Leasing</h1>
        
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-lg mb-6">
            <p className="text-red-300">{error}</p>
            <button 
              className="text-white underline mt-2"
              onClick={() => setError('')}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {!walletConnected ? (
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="mb-4">Connect your Web3 wallet to lease batteries and manage your existing leases.</p>
            <button 
              className="bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
              onClick={connectWallet}
              disabled={transactionPending}
            >
              {transactionPending ? 'Processing...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg mb-6">
            <p className="text-sm">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Batteries */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Available Batteries</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : batteries.length === 0 ? (
              <p className="text-gray-400">No batteries available for lease.</p>
            ) : (
              <div className="space-y-4">
                {batteries.filter(b => b.isAvailable).map((battery) => (
                  <div 
                    key={battery._id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedBattery?._id === battery._id 
                        ? 'bg-orange-500/20 border border-orange-500/50' 
                        : 'bg-gray-700/50 hover:bg-gray-700/70'
                    }`}
                    onClick={() => setSelectedBattery(battery)}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{battery.manufacturer} - {battery.serialNumber}</h3>
                      <span className="text-orange-400">${battery.dailyRate}/day</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Capacity: {battery.capacity} Wh</p>
                      <p>Charge Level: {battery.chargeLevel}%</p>
                      <p>Status: {battery.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedBattery && (
              <div className="mt-6 p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg">
                <h3 className="font-medium mb-2">Lease Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Duration (days)
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      max="365"
                      value={leaseDuration}
                      onChange={(e) => setLeaseDuration(parseInt(e.target.value))}
                      className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300">
                      Total Cost: ${(selectedBattery.dailyRate * leaseDuration).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-300">
                      Deposit: ${(selectedBattery.dailyRate * leaseDuration * 0.5).toFixed(2)} (50%)
                    </p>
                  </div>
                  
                  <button 
                    className="w-full bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
                    onClick={createLease}
                    disabled={!walletConnected || transactionPending}
                  >
                    {transactionPending ? 'Processing...' : 'Lease Battery'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Active Leases */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Leases</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : leases.length === 0 ? (
              <p className="text-gray-400">You don't have any active leases.</p>
            ) : (
              <div className="space-y-4">
                {leases.map((lease) => (
                  <div 
                    key={lease._id}
                    className="p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {lease.battery?.manufacturer} - {lease.battery?.serialNumber}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        lease.status === 'active' 
                          ? 'bg-green-500/20 text-green-300' 
                          : lease.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-4">
                      <p>Start: {new Date(lease.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(lease.endDate).toLocaleDateString()}</p>
                      <p>Total: ${lease.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    {lease.status === 'active' && (
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/70 text-white px-3 py-1.5 rounded-lg text-sm"
                          onClick={() => completeLease(lease._id, lease.blockchainLeaseId)}
                          disabled={transactionPending}
                        >
                          {transactionPending ? 'Processing...' : 'Return Battery'}
                        </button>
                        <button 
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-sm"
                          onClick={() => cancelLease(lease._id, lease.blockchainLeaseId)}
                          disabled={transactionPending}
                        >
                          {transactionPending ? 'Processing...' : 'Cancel Lease'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryLeasing;
