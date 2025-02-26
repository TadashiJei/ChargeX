/**
 * Web3 Service
 * 
 * This service handles all interactions with the blockchain, including
 * smart contract calls, transaction signing, and wallet connections.
 */

import { ethers } from 'ethers';
import { BatteryLeasingABI, EnergyTradingABI } from '../contracts/abis';

// Enum for lease status
enum LeaseStatus {
  Active,
  Completed,
  Cancelled
}

// Enum for trade status
enum TradeStatus {
  Open,
  Completed,
  Cancelled
}

// Define interface for battery data
export interface Battery {
  id: string;
  owner: string;
  manufacturer: string;
  model: string;
  capacity: number;
  manufactureDate: Date;
  warrantyPeriod: number;
  isLeased: boolean;
  currentLessee: string;
  leaseStartDate: Date | null;
  leaseEndDate: Date | null;
  dailyRate: number;
}

// Define interface for energy trade
export interface EnergyTrade {
  id: string;
  seller: string;
  buyer: string | null;
  energyAmount: number;
  pricePerUnit: number;
  totalPrice: number;
  status: 'open' | 'completed' | 'cancelled';
  timestamp: Date;
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
  
  // Initialize smart contracts
  private async initializeContracts(): Promise<void> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const batteryLeasingAddress = process.env.NEXT_PUBLIC_BATTERY_LEASING_CONTRACT_ADDRESS;
      const energyTradingAddress = process.env.NEXT_PUBLIC_ENERGY_TRADING_CONTRACT_ADDRESS;
      
      if (!batteryLeasingAddress || !energyTradingAddress) {
        throw new Error('Contract addresses not defined in environment variables');
      }
      
      this.batteryLeasingContract = new ethers.Contract(
        batteryLeasingAddress,
        BatteryLeasingABI,
        this.signer
      );
      
      this.energyTradingContract = new ethers.Contract(
        energyTradingAddress,
        EnergyTradingABI,
        this.signer
      );
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw error;
    }
  }
  
  // Get the BatteryLeasing contract instance
  getBatteryLeasingContract() {
    if (!this.batteryLeasingContract) {
      throw new Error('BatteryLeasing contract not initialized');
    }
    return this.batteryLeasingContract;
  }
  
  // Get the EnergyTrading contract instance
  getEnergyTradingContract() {
    if (!this.energyTradingContract) {
      throw new Error('EnergyTrading contract not initialized');
    }
    return this.energyTradingContract;
  }
  
  // Register a new battery
  async registerBattery(serialNumber: string, capacity: number, dailyRate: string): Promise<{ batteryId: string, txHash: string }> {
    const contract = this.getBatteryLeasingContract();
    
    const tx = await contract.registerBattery(
      serialNumber,
      capacity,
      ethers.parseEther(dailyRate)
    );
    
    const receipt = await tx.wait();
    
    // Extract batteryId from event logs
    const event = receipt.logs.find(log => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog?.name === 'BatteryRegistered';
      } catch (e) {
        return false;
      }
    });
    
    const parsedEvent = event ? contract.interface.parseLog(event) : null;
    const batteryId = parsedEvent?.args?.batteryId.toString();
    
    return {
      batteryId,
      txHash: receipt.hash
    };
  }
  
  // Update battery details
  async updateBattery(batteryId: string, dailyRate: string, isAvailable: boolean): Promise<string> {
    const contract = this.getBatteryLeasingContract();
    
    const tx = await contract.updateBattery(
      batteryId,
      ethers.parseEther(dailyRate),
      isAvailable
    );
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
  
  // Lease a battery
  async leaseBattery(batteryId: string, leaseDuration: number): Promise<string> {
    const contract = this.getBatteryLeasingContract();
    
    // Get daily rate
    const battery = await contract.getBattery(batteryId);
    const dailyRate = battery.dailyRate;
    
    // Calculate total lease cost
    const totalCost = dailyRate * BigInt(leaseDuration);
    
    // Execute lease transaction with payment
    const tx = await contract.leaseBattery(batteryId, leaseDuration, {
      value: totalCost
    });
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
  
  // End a lease
  async endLease(leaseId: string): Promise<string> {
    const contract = this.getBatteryLeasingContract();
    
    const tx = await contract.endLease(leaseId);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }
  
  // Get all batteries
  async getAllBatteries(): Promise<Battery[]> {
    const contract = this.getBatteryLeasingContract();
    
    const batteryCount = await contract.getBatteryCount();
    const batteries: Battery[] = [];
    
    for (let i = 0; i < batteryCount; i++) {
      const batteryId = await contract.getBatteryIdByIndex(i);
      const battery = await this.getBattery(batteryId);
      if (battery) {
        batteries.push(battery);
      }
    }
    
    return batteries;
  }
  
  // Get a single battery by ID
  async getBattery(batteryId: string): Promise<Battery | null> {
    const contract = this.getBatteryLeasingContract();
    
    try {
      const batteryData = await contract.getBattery(batteryId);
      
      return {
        id: batteryId,
        owner: batteryData.owner,
        manufacturer: batteryData.manufacturer,
        model: batteryData.model,
        capacity: Number(batteryData.capacity),
        manufactureDate: new Date(Number(batteryData.manufactureDate) * 1000),
        warrantyPeriod: Number(batteryData.warrantyPeriod),
        isLeased: batteryData.isLeased,
        currentLessee: batteryData.currentLessee,
        leaseStartDate: batteryData.leaseStartDate > 0 ? new Date(Number(batteryData.leaseStartDate) * 1000) : null,
        leaseEndDate: batteryData.leaseEndDate > 0 ? new Date(Number(batteryData.leaseEndDate) * 1000) : null,
        dailyRate: Number(ethers.formatEther(batteryData.dailyRate))
      };
    } catch (error) {
      console.error('Error getting battery:', error);
      return null;
    }
  }
  
  // Create a new energy trade
  async createEnergyTrade(energyAmount: number, pricePerUnit: string): Promise<string> {
    const contract = this.getEnergyTradingContract();
    
    const tx = await contract.createTrade(
      energyAmount,
      ethers.parseEther(pricePerUnit)
    );
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
  
  // Buy energy from a trade
  async buyEnergy(tradeId: string): Promise<string> {
    const contract = this.getEnergyTradingContract();
    
    // Get trade details
    const trade = await contract.getTrade(tradeId);
    const totalCost = trade.pricePerUnit * trade.energyAmount;
    
    // Execute buy transaction with payment
    const tx = await contract.buyEnergy(tradeId, {
      value: totalCost
    });
    
    const receipt = await tx.wait();
    return receipt.hash;
  }
  
  // Cancel an energy trade
  async cancelEnergyTrade(tradeId: string): Promise<string> {
    const contract = this.getEnergyTradingContract();
    
    const tx = await contract.cancelTrade(tradeId);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }
  
  // Get all energy trades
  async getAllEnergyTrades(): Promise<EnergyTrade[]> {
    const contract = this.getEnergyTradingContract();
    
    const tradeCount = await contract.getTradeCount();
    const trades: EnergyTrade[] = [];
    
    for (let i = 0; i < tradeCount; i++) {
      const tradeId = await contract.getTradeIdByIndex(i);
      const trade = await this.getEnergyTrade(tradeId);
      if (trade) {
        trades.push(trade);
      }
    }
    
    return trades;
  }
  
  // Get a single energy trade by ID
  async getEnergyTrade(tradeId: string): Promise<EnergyTrade | null> {
    const contract = this.getEnergyTradingContract();
    
    try {
      const tradeData = await contract.getTrade(tradeId);
      
      let status: 'open' | 'completed' | 'cancelled';
      switch (Number(tradeData.status)) {
        case TradeStatus.Open:
          status = 'open';
          break;
        case TradeStatus.Completed:
          status = 'completed';
          break;
        case TradeStatus.Cancelled:
          status = 'cancelled';
          break;
        default:
          status = 'open';
      }
      
      return {
        id: tradeId,
        seller: tradeData.seller,
        buyer: tradeData.buyer === ethers.ZeroAddress ? null : tradeData.buyer,
        energyAmount: Number(tradeData.energyAmount),
        pricePerUnit: Number(ethers.formatEther(tradeData.pricePerUnit)),
        totalPrice: Number(ethers.formatEther(tradeData.pricePerUnit)) * Number(tradeData.energyAmount),
        status,
        timestamp: new Date(Number(tradeData.timestamp) * 1000)
      };
    } catch (error) {
      console.error('Error getting energy trade:', error);
      return null;
    }
  }
}

// Create singleton instance
const web3Service = new Web3Service();
export { web3Service };
export default web3Service;
