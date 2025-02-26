import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EnergyTrade from "@/models/EnergyTrade";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Buy energy from a trade
export async function POST(
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
    
    const userId = decoded.userId;
    const tradeId = params.id;
    
    // Find the trade
    const trade = await EnergyTrade.findById(tradeId);
    
    if (!trade) {
      return NextResponse.json(
        { error: "Trade not found" },
        { status: 404 }
      );
    }
    
    // Check if trade is still open
    if (trade.status !== 'open') {
      return NextResponse.json(
        { error: "This trade is no longer available" },
        { status: 400 }
      );
    }
    
    // Check if user is trying to buy their own trade
    if (trade.sellerId.toString() === userId) {
      return NextResponse.json(
        { error: "You cannot buy your own trade" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Update trade with buyer info and mark as completed
    trade.buyerId = userId;
    trade.status = 'completed';
    trade.completedAt = new Date();
    
    if (body.transactionHash) {
      trade.transactionHash = body.transactionHash;
    }
    
    await trade.save();
    
    // Get buyer and seller names for the response
    const buyer = await User.findById(userId);
    const seller = await User.findById(trade.sellerId);
    
    // Broadcast trade update via WebSocket
    // This would be implemented in a production environment
    
    return NextResponse.json({ 
      success: true,
      trade: {
        ...trade.toObject(),
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : undefined,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : undefined
      }
    });
  } catch (error) {
    console.error("Error buying energy:", error);
    return NextResponse.json(
      { error: "Failed to complete energy purchase" },
      { status: 500 }
    );
  }
}
