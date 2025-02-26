import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EnergyTrade from "@/models/EnergyTrade";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Get all energy trades with optional filtering
export async function GET(request: Request) {
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
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const sellerId = searchParams.get('sellerId');
    const buyerId = searchParams.get('buyerId');
    
    // Build query
    const query: any = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    
    // Regular users can only see their own trades or listed trades
    if (decoded.role !== 'admin') {
      if (sellerId || buyerId) {
        // If user is specifically querying by seller or buyer
        const userQuery: any = {};
        
        if (sellerId) userQuery.seller = new mongoose.Types.ObjectId(sellerId);
        if (buyerId) userQuery.buyer = new mongoose.Types.ObjectId(buyerId);
        
        // Combine with existing query
        query.$or = [
          { ...userQuery },
          { status: 'listed' } // Always include listed trades
        ];
      } else {
        // Default for regular users: see their own trades or listed trades
        query.$or = [
          { seller: new mongoose.Types.ObjectId(decoded.userId) },
          { buyer: new mongoose.Types.ObjectId(decoded.userId) },
          { status: 'listed' }
        ];
      }
    } else {
      // Admin can filter by specific seller or buyer
      if (sellerId) query.seller = new mongoose.Types.ObjectId(sellerId);
      if (buyerId) query.buyer = new mongoose.Types.ObjectId(buyerId);
    }
    
    const trades = await EnergyTrade.find(query)
      .populate('seller', 'firstName lastName email')
      .populate('buyer', 'firstName lastName email')
      .populate('battery', 'serialNumber model capacity health')
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({ trades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching energy trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch energy trades" },
      { status: 500 }
    );
  }
}

// Create a new energy trade listing
export async function POST(request: Request) {
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
    
    // Validate required fields
    const requiredFields = ['battery', 'energyAmount', 'price', 'type', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if battery exists and belongs to the user
    const battery = await Battery.findById(data.battery);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    // Create energy trade listing
    const trade = new EnergyTrade({
      ...data,
      seller: decoded.userId,
      status: 'listed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Set expiration date if provided
    if (data.expiresAt) {
      trade.expiresAt = new Date(data.expiresAt);
    }
    
    await trade.save();
    
    // Populate seller and battery details for response
    await trade.populate('seller', 'firstName lastName email');
    await trade.populate('battery', 'serialNumber model capacity health');
    
    return NextResponse.json({ trade }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating energy trade:", error);
    return NextResponse.json(
      { error: "Failed to create energy trade" },
      { status: 500 }
    );
  }
}
