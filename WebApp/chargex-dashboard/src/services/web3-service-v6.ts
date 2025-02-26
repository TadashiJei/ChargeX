/**
 * Web3 Service (ethers.js v6 version)
 * 
 * This service handles all interactions with the blockchain, including
 * smart contract calls, transaction signing, and wallet connections.
 */

import { ethers } from 'ethers';

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
];

// ABI for the EnergyTrading contract
const ENERGY_TRADING_ABI = [
  // Events
  "event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 energyAmount, uint256 price, uint8 orderType)",
  "event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 amount)",
  "event OrderCancelled(uint256 indexed orderId)",
  
  // Functions
  "function createOrder(uint256 energyAmount, uint256 price, uint8 orderType) external returns (uint256)",
  "function fillOrder(uint256 orderId) external payable returns (bool)",
  "function cancelOrder(uint256 orderId) external returns (bool)",
  "function getOrder(uint256 orderId) external view returns (address seller, uint256 energyAmount, uint256 price, bool isFilled, bool isCancelled)",
];

// Contract addresses
const BATTERY_LEASING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BATTERY_LEASING_CONTRACT_ADDRESS;
const ENERGY_TRADING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ENERGY_TRADING_CONTRACT_ADDRESS;

// Check if contract addresses are configured
if (!BATTERY_LEASING_CONTRACT_ADDRESS || !ENERGY_TRADING_CONTRACT_ADDRESS) {
  console.warn('Smart contract addresses are not defined in environment variables. Web3 functionality will be limited.');
}

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private batteryLeasingContract: ethers.Contract | null = null;
  private energyTradingContract: ethers.Contract | null = null;
  
  constructor() {
    // Initialize provider if window is defined (client-side)
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }
  
  // Connect to MetaMask wallet
  async connectWallet(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      // Get signer
      this.signer = await this.provider.getSigner();
      
      // Initialize contracts
      await this.initializeContracts();
      
      return accounts;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  }
  
  // Get current connected account
  async getCurrentAccount(): Promise<string | null> {
    if (!this.provider) {
      return null;
    }
    
    try {
      const accounts = await this.provider.listAccounts();
      return accounts.length > 0 ? accounts[0].address : null;
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  }
  
  // Initialize contracts
  private async initializeContracts() {
    if (!this.signer) {
      throw new Error('No signer available. Connect wallet first.');
    }
    
    if (BATTERY_LEASING_CONTRACT_ADDRESS) {
      this.batteryLeasingContract = new ethers.Contract(
        BATTERY_LEASING_CONTRACT_ADDRESS,
        BATTERY_LEASING_ABI,
        this.signer
      );
    }
    
    if (ENERGY_TRADING_CONTRACT_ADDRESS) {
      this.energyTradingContract = new ethers.Contract(
        ENERGY_TRADING_CONTRACT_ADDRESS,
        ENERGY_TRADING_ABI,
        this.signer
      );
    }
  }
  
  // Get the BatteryLeasing contract instance
  getBatteryLeasingContract() {
    if (!this.batteryLeasingContract) {
      throw new Error('Battery leasing contract not initialized');
    }
    return this.batteryLeasingContract;
  }
  
  // Get the EnergyTrading contract instance
  getEnergyTradingContract() {
    if (!this.energyTradingContract) {
      throw new Error('Energy trading contract not initialized');
    }
    return this.energyTradingContract;
  }
  
  // Lease a battery
  async leaseBattery(batteryId: number, durationHours: number, amount: string) {
    try {
      const contract = this.getBatteryLeasingContract();
      const tx = await contract.leaseBattery(batteryId, durationHours, {
        value: ethers.parseEther(amount)
      });
      
      return await tx.wait();
    } catch (error) {
      console.error('Error leasing battery:', error);
      throw error;
    }
  }
  
  // Return a battery
  async returnBattery(leaseId: number, finalCharge: number) {
    try {
      const contract = this.getBatteryLeasingContract();
      const tx = await contract.returnBattery(leaseId, finalCharge);
      
      return await tx.wait();
    } catch (error) {
      console.error('Error returning battery:', error);
      throw error;
    }
  }
  
  // Create a sell order for energy
  async createSellOrder(energyAmount: number, price: string, orderType: number) {
    try {
      const contract = this.getEnergyTradingContract();
      const priceWei = ethers.parseEther(price);
      
      const tx = await contract.createOrder(energyAmount, priceWei, orderType);
      
      return await tx.wait();
    } catch (error) {
      console.error('Error creating sell order:', error);
      throw error;
    }
  }
  
  // Fill an energy order
  async fillOrder(orderId: number, amount: string) {
    try {
      const contract = this.getEnergyTradingContract();
      const tx = await contract.fillOrder(orderId, {
        value: ethers.parseEther(amount)
      });
      
      return await tx.wait();
    } catch (error) {
      console.error('Error filling order:', error);
      throw error;
    }
  }
  
  // Cancel an energy order
  async cancelOrder(orderId: number) {
    try {
      const contract = this.getEnergyTradingContract();
      const tx = await contract.cancelOrder(orderId);
      
      return await tx.wait();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
  
  // Get gas price
  async getGasPrice() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    try {
      return await this.provider.getFeeData();
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw error;
    }
  }
  
  // Estimate gas for a transaction
  async estimateGas(to: string, data: string, value: string = '0') {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    try {
      const account = await this.getCurrentAccount();
      if (!account) {
        throw new Error('No account connected');
      }
      
      return await this.provider.estimateGas({
        from: account,
        to,
        data,
        value: ethers.parseEther(value)
      });
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }
}

// Create singleton instance
const web3Service = new Web3Service();
export { web3Service };
export default web3Service;
