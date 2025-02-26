/**
 * Web3 Service
 * 
 * This service handles all interactions with the blockchain, including
 * smart contract calls, transaction signing, and wallet connections.
 */

import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

// ABI for the BatteryLeasing contract
const BATTERY_LEASING_ABI = [
  // Events
  "event BatteryLeased(uint256 indexed batteryId, address indexed lessee, uint256 startTime, uint256 endTime, uint256 amount)",
  "event BatteryReturned(uint256 indexed batteryId, address indexed lessee, uint256 returnTime, uint256 finalCharge)",
  "event PaymentProcessed(uint256 indexed batteryId, address indexed payer, uint256 amount)",
  
  // Functions
  "function leaseBattery(uint256 batteryId, uint256 duration) external payable returns (uint256)",
  "function returnBattery(uint256 leaseId, uint256 finalCharge) external returns (bool)",
  "function getBatteryStatus(uint256 batteryId) external view returns (uint8 status, address currentLessee, uint256 leaseEndTime)",
  "function getLeaseDetails(uint256 leaseId) external view returns (uint256 batteryId, address lessee, uint256 startTime, uint256 endTime, uint256 amount, bool isActive)",
  "function getActiveLeasesCount() external view returns (uint256)",
  "function getUserActiveLeases(address user) external view returns (uint256[] memory)",
];

// ABI for the EnergyTrading contract
const ENERGY_TRADING_ABI = [
  // Events
  "event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 energyAmount, uint256 price, uint8 orderType)",
  "event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 amount)",
  "event OrderCancelled(uint256 indexed orderId, address indexed seller)",
  
  // Functions
  "function createSellOrder(uint256 energyAmount, uint256 price, uint8 orderType) external returns (uint256)",
  "function fillOrder(uint256 orderId) external payable returns (bool)",
  "function cancelOrder(uint256 orderId) external returns (bool)",
  "function getOrderDetails(uint256 orderId) external view returns (address seller, uint256 energyAmount, uint256 price, uint8 status, uint8 orderType)",
  "function getActiveOrders() external view returns (uint256[] memory)",
  "function getUserOrders(address user) external view returns (uint256[] memory)",
];

// Contract addresses
const BATTERY_LEASING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BATTERY_LEASING_CONTRACT_ADDRESS;
const ENERGY_TRADING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ENERGY_TRADING_CONTRACT_ADDRESS;

// Check if contract addresses are configured
if (!BATTERY_LEASING_CONTRACT_ADDRESS || !ENERGY_TRADING_CONTRACT_ADDRESS) {
  console.warn('Smart contract addresses are not defined in environment variables. Web3 functionality will be limited.');
}

/**
 * Initialize Web3 provider
 */
export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet(): Promise<string[]> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts;
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
}

/**
 * Get the current connected account
 */
export async function getCurrentAccount(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) {
    return null;
  }
  
  try {
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}

/**
 * Get the BatteryLeasing contract instance
 */
export function getBatteryLeasingContract() {
  const provider = getProvider();
  if (!provider || !BATTERY_LEASING_CONTRACT_ADDRESS) {
    return null;
  }
  
  const signer = provider.getSigner();
  return new ethers.Contract(BATTERY_LEASING_CONTRACT_ADDRESS, BATTERY_LEASING_ABI, signer);
}

/**
 * Get the EnergyTrading contract instance
 */
export function getEnergyTradingContract() {
  const provider = getProvider();
  if (!provider || !ENERGY_TRADING_CONTRACT_ADDRESS) {
    return null;
  }
  
  const signer = provider.getSigner();
  return new ethers.Contract(ENERGY_TRADING_CONTRACT_ADDRESS, ENERGY_TRADING_ABI, signer);
}

/**
 * Lease a battery
 */
export async function leaseBattery(batteryId: number, durationHours: number, amount: string) {
  const contract = getBatteryLeasingContract();
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  
  try {
    const tx = await contract.leaseBattery(batteryId, durationHours * 3600, {
      value: ethers.utils.parseEther(amount)
    });
    return await tx.wait();
  } catch (error) {
    console.error('Error leasing battery:', error);
    throw error;
  }
}

/**
 * Return a battery
 */
export async function returnBattery(leaseId: number, finalCharge: number) {
  const contract = getBatteryLeasingContract();
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  
  try {
    const tx = await contract.returnBattery(leaseId, finalCharge);
    return await tx.wait();
  } catch (error) {
    console.error('Error returning battery:', error);
    throw error;
  }
}

/**
 * Create a sell order for energy
 */
export async function createSellOrder(energyAmount: number, price: string, orderType: number) {
  const contract = getEnergyTradingContract();
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  
  try {
    const tx = await contract.createSellOrder(
      energyAmount,
      ethers.utils.parseEther(price),
      orderType
    );
    return await tx.wait();
  } catch (error) {
    console.error('Error creating sell order:', error);
    throw error;
  }
}

/**
 * Fill an energy order
 */
export async function fillOrder(orderId: number, amount: string) {
  const contract = getEnergyTradingContract();
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  
  try {
    const tx = await contract.fillOrder(orderId, {
      value: ethers.utils.parseEther(amount)
    });
    return await tx.wait();
  } catch (error) {
    console.error('Error filling order:', error);
    throw error;
  }
}

/**
 * Cancel an energy order
 */
export async function cancelOrder(orderId: number) {
  const contract = getEnergyTradingContract();
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  
  try {
    const tx = await contract.cancelOrder(orderId);
    return await tx.wait();
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

/**
 * Get gas price
 */
export async function getGasPrice() {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  try {
    return await provider.getGasPrice();
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(to: string, data: string, value: string = '0') {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  
  try {
    const account = await getCurrentAccount();
    if (!account) {
      throw new Error('No account connected');
    }
    
    return await provider.estimateGas({
      from: account,
      to,
      data,
      value: ethers.utils.parseEther(value)
    });
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
}

class Web3Service {
  // Add methods here
}

// Create singleton instance
export default new Web3Service();
