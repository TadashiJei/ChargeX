'use client';

import { useState, useEffect } from 'react';
import web3Service from '@/services/web3-service-v6';
import { GlowingEffect } from '@/components/ui/GlowingEffect';

interface EnergyTrade {
  _id: string;
  sellerId: string;
  sellerName?: string;
  energyAmount: number;
  pricePerUnit: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  buyerId?: string;
  buyerName?: string;
  completedAt?: string;
  blockchainOrderId?: string;
  transactionHash?: string;
}

const EnergyTrading = () => {
  const [trades, setTrades] = useState<EnergyTrade[]>([]);
  const [userTrades, setUserTrades] = useState<EnergyTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [transactionPending, setTransactionPending] = useState(false);
  
  // New trade form state
  const [energyAmount, setEnergyAmount] = useState(10);
  const [pricePerUnit, setPricePerUnit] = useState(0.05);
  const [isCreatingTrade, setIsCreatingTrade] = useState(false);
  
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

  // Fetch all available energy trades
  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trading');
      
      if (!response.ok) {
        throw new Error('Failed to fetch energy trades');
      }
      
      const data = await response.json();
      setTrades(data.trades.filter((trade: EnergyTrade) => trade.status === 'open'));
    } catch (error) {
      console.error('Error fetching energy trades:', error);
      setError('Failed to load energy trades. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's trades
  const fetchUserTrades = async () => {
    if (!account) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/trading?userId=${account}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user trades');
      }
      
      const data = await response.json();
      setUserTrades(data.trades);
    } catch (error) {
      console.error('Error fetching user trades:', error);
      setError('Failed to load your trades. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new energy trade listing
  const createTrade = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, create the sell order on the blockchain
      const { orderId, txHash } = await web3Service.createSellOrder(
        energyAmount,
        pricePerUnit.toString()
      );
      
      // Then, create the trade in our database
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: account,
          energyAmount,
          pricePerUnit,
          totalPrice: energyAmount * pricePerUnit,
          status: 'open',
          expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
          blockchainOrderId: orderId,
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create energy trade');
      }
      
      // Refresh trades
      await fetchTrades();
      await fetchUserTrades();
      
      // Reset form
      setEnergyAmount(10);
      setPricePerUnit(0.05);
      setIsCreatingTrade(false);
      
      alert('Energy trade created successfully!');
    } catch (error) {
      console.error('Error creating energy trade:', error);
      setError('Failed to create energy trade. Please try again.');
    } finally {
      setTransactionPending(false);
    }
  };

  // Buy energy from a trade
  const buyEnergy = async (trade: EnergyTrade) => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, fill the order on the blockchain
      const txHash = await web3Service.fillOrder(
        trade.blockchainOrderId as string,
        trade.totalPrice.toString()
      );
      
      // Then, update the trade in our database
      const response = await fetch(`/api/trading/${trade._id}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId: account,
          status: 'completed',
          completedAt: new Date().toISOString(),
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to buy energy');
      }
      
      // Refresh trades
      await fetchTrades();
      await fetchUserTrades();
      
      alert('Energy purchased successfully!');
    } catch (error) {
      console.error('Error buying energy:', error);
      setError('Failed to buy energy. Please try again.');
    } finally {
      setTransactionPending(false);
    }
  };

  // Cancel a trade
  const cancelTrade = async (trade: EnergyTrade) => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setTransactionPending(true);
      
      // First, cancel the order on the blockchain
      const txHash = await web3Service.cancelOrder(
        trade.blockchainOrderId as string
      );
      
      // Then, update the trade in our database
      const response = await fetch(`/api/trading/${trade._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          transactionHash: txHash
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel trade');
      }
      
      // Refresh trades
      await fetchTrades();
      await fetchUserTrades();
      
      alert('Trade cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling trade:', error);
      setError('Failed to cancel trade. Please try again.');
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

  // Load trades on mount and when account changes
  useEffect(() => {
    fetchTrades();
    if (account) {
      fetchUserTrades();
    }
  }, [account]);

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
        <h1 className="text-2xl font-bold mb-6">Energy Trading Platform</h1>
        
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
            <p className="mb-4">Connect your Web3 wallet to buy and sell energy on the platform.</p>
            <button 
              className="bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
              onClick={connectWallet}
              disabled={transactionPending}
            >
              {transactionPending ? 'Processing...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg mb-6 flex justify-between items-center">
            <p className="text-sm">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            <button 
              className="bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
              onClick={() => setIsCreatingTrade(!isCreatingTrade)}
              disabled={transactionPending}
            >
              {isCreatingTrade ? 'Cancel' : 'Sell Energy'}
            </button>
          </div>
        )}
        
        {isCreatingTrade && (
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Energy Trade</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Energy Amount (Wh)
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={energyAmount}
                  onChange={(e) => setEnergyAmount(parseInt(e.target.value))}
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Price Per Unit (ETH)
                </label>
                <input 
                  type="number" 
                  min="0.001"
                  step="0.001"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-300">
                  Total Price: {(energyAmount * pricePerUnit).toFixed(4)} ETH
                </p>
              </div>
              
              <button 
                className="w-full bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
                onClick={createTrade}
                disabled={!walletConnected || transactionPending}
              >
                {transactionPending ? 'Processing...' : 'Create Trade'}
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Energy Trades */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Available Energy</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : trades.length === 0 ? (
              <p className="text-gray-400">No energy trades available.</p>
            ) : (
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div 
                    key={trade._id}
                    className="p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {trade.energyAmount} Wh
                      </h3>
                      <span className="text-orange-400">
                        {trade.pricePerUnit.toFixed(4)} ETH/Wh
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-4">
                      <p>Seller: {trade.sellerName || trade.sellerId.substring(0, 6) + '...' + trade.sellerId.substring(trade.sellerId.length - 4)}</p>
                      <p>Total: {trade.totalPrice.toFixed(4)} ETH</p>
                      <p>Expires: {new Date(trade.expiresAt).toLocaleDateString()}</p>
                    </div>
                    
                    {trade.sellerId !== account && (
                      <button 
                        className="w-full bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white px-4 py-2 rounded-lg"
                        onClick={() => buyEnergy(trade)}
                        disabled={!walletConnected || transactionPending}
                      >
                        {transactionPending ? 'Processing...' : 'Buy Energy'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* User's Trades */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Trades</h2>
            
            {!walletConnected ? (
              <p className="text-gray-400">Connect your wallet to view your trades.</p>
            ) : loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : userTrades.length === 0 ? (
              <p className="text-gray-400">You don't have any trades yet.</p>
            ) : (
              <div className="space-y-4">
                {userTrades.map((trade) => (
                  <div 
                    key={trade._id}
                    className="p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {trade.energyAmount} Wh
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.status === 'open' 
                          ? 'bg-green-500/20 text-green-300' 
                          : trade.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-4">
                      <p>Price: {trade.pricePerUnit.toFixed(4)} ETH/Wh</p>
                      <p>Total: {trade.totalPrice.toFixed(4)} ETH</p>
                      {trade.status === 'completed' && trade.buyerId && (
                        <p>Buyer: {trade.buyerName || trade.buyerId.substring(0, 6) + '...' + trade.buyerId.substring(trade.buyerId.length - 4)}</p>
                      )}
                      {trade.status === 'open' && (
                        <p>Expires: {new Date(trade.expiresAt).toLocaleDateString()}</p>
                      )}
                      {trade.status === 'completed' && trade.completedAt && (
                        <p>Completed: {new Date(trade.completedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    {trade.status === 'open' && trade.sellerId === account && (
                      <button 
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg"
                        onClick={() => cancelTrade(trade)}
                        disabled={transactionPending}
                      >
                        {transactionPending ? 'Processing...' : 'Cancel Trade'}
                      </button>
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

export default EnergyTrading;
