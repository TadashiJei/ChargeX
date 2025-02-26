import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EnergyTrade from "@/models/EnergyTrade";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";
import web3Service from "@/services/web3-service-v6";

// Get a specific energy trade by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const trade = await EnergyTrade.findById(params.id)
      .populate('seller', 'firstName lastName email walletAddress')
      .populate('buyer', 'firstName lastName email walletAddress')
      .populate('battery', 'serialNumber model capacity health status');
    
    if (!trade) {
      return NextResponse.json(
        { error: "Energy trade not found" },
        { status: 404 }
      );
    }
    
    // Regular users can only see their own trades or listed trades
    if (decoded.role !== 'admin' && 
        trade.seller._id.toString() !== decoded.userId && 
        (trade.buyer?._id.toString() !== decoded.userId && trade.status !== 'listed')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ trade }, { status: 200 });
  } catch (error) {
    console.error("Error fetching energy trade:", error);
    return NextResponse.json(
      { error: "Failed to fetch energy trade" },
      { status: 500 }
    );
  }
}

// Update an energy trade (buy, cancel, complete)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Find the trade
    const trade = await EnergyTrade.findById(params.id);
    
    if (!trade) {
      return NextResponse.json(
        { error: "Energy trade not found" },
        { status: 404 }
      );
    }
    
    // Handle different update scenarios
    
    // 1. Buy a listed trade
    if (data.action === 'buy' && trade.status === 'listed') {
      // User cannot buy their own listing
      if (trade.seller.toString() === decoded.userId) {
        return NextResponse.json(
          { error: "You cannot buy your own energy listing" },
          { status: 400 }
        );
      }
      
      // Update trade
      trade.buyer = new mongoose.Types.ObjectId(decoded.userId);
      trade.status = 'pending';
      trade.updatedAt = new Date();
      
      // If Web3 transaction hash is provided, process blockchain transaction
      if (data.transactionHash) {
        try {
          // Verify the transaction on the blockchain
          const verified = await web3Service.verifyEnergyTradeTransaction(
            data.transactionHash,
            trade.price,
            trade.energyAmount
          );
          
          if (verified) {
            trade.transactionHash = data.transactionHash;
            trade.status = 'completed';
          } else {
            return NextResponse.json(
              { error: "Transaction verification failed" },
              { status: 400 }
            );
          }
        } catch (error) {
          console.error("Blockchain verification error:", error);
          return NextResponse.json(
            { error: "Failed to verify blockchain transaction" },
            { status: 500 }
          );
        }
      }
      
      await trade.save();
      
      // Populate details for response
      await trade.populate('seller', 'firstName lastName email');
      await trade.populate('buyer', 'firstName lastName email');
      await trade.populate('battery', 'serialNumber model capacity health');
      
      return NextResponse.json({ trade }, { status: 200 });
    }
    
    // 2. Cancel a trade (seller can cancel listed, admin can cancel any)
    if (data.action === 'cancel') {
      // Check authorization
      if (trade.status === 'listed' && trade.seller.toString() === decoded.userId) {
        // Seller can cancel their own listing
        trade.status = 'cancelled';
        trade.updatedAt = new Date();
        
        await trade.save();
        
        return NextResponse.json(
          { message: "Energy trade listing cancelled successfully" },
          { status: 200 }
        );
      } else if (decoded.role === 'admin') {
        // Admin can cancel any trade
        trade.status = 'cancelled';
        trade.updatedAt = new Date();
        
        await trade.save();
        
        return NextResponse.json(
          { message: "Energy trade cancelled by admin" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Unauthorized to cancel this trade" },
          { status: 403 }
        );
      }
    }
    
    // 3. Complete a pending trade (seller or admin)
    if (data.action === 'complete' && trade.status === 'pending') {
      if (trade.seller.toString() === decoded.userId || decoded.role === 'admin') {
        // Verify transaction hash if provided
        if (data.transactionHash && !trade.transactionHash) {
          try {
            // Verify the transaction on the blockchain
            const verified = await web3Service.verifyEnergyTradeTransaction(
              data.transactionHash,
              trade.price,
              trade.energyAmount
            );
            
            if (verified) {
              trade.transactionHash = data.transactionHash;
            } else {
              return NextResponse.json(
                { error: "Transaction verification failed" },
                { status: 400 }
              );
            }
          } catch (error) {
            console.error("Blockchain verification error:", error);
            return NextResponse.json(
              { error: "Failed to verify blockchain transaction" },
              { status: 500 }
            );
          }
        }
        
        trade.status = 'completed';
        trade.updatedAt = new Date();
        
        await trade.save();
        
        // Populate details for response
        await trade.populate('seller', 'firstName lastName email');
        await trade.populate('buyer', 'firstName lastName email');
        await trade.populate('battery', 'serialNumber model capacity health');
        
        return NextResponse.json({ trade }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Unauthorized to complete this trade" },
          { status: 403 }
        );
      }
    }
    
    // If none of the above actions match
    return NextResponse.json(
      { error: "Invalid action or trade status" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating energy trade:", error);
    return NextResponse.json(
      { error: "Failed to update energy trade" },
      { status: 500 }
    );
  }
}
