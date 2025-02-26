import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lease from "@/models/Lease";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Get all leases with optional filtering
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
    const userId = searchParams.get('userId');
    const batteryId = searchParams.get('batteryId');
    
    // Build query
    const query: any = {};
    
    // Regular users can only see their own leases
    if (decoded.role !== 'admin') {
      query.user = new mongoose.Types.ObjectId(decoded.userId);
    } else if (userId) {
      query.user = new mongoose.Types.ObjectId(userId);
    }
    
    if (status) query.status = status;
    if (batteryId) query.battery = new mongoose.Types.ObjectId(batteryId);
    
    const leases = await Lease.find(query)
      .populate('user', 'firstName lastName email')
      .populate('battery', 'serialNumber model capacity health')
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({ leases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}

// Create a new lease
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
    const requiredFields = ['battery', 'endDate', 'cost', 'paymentMethod', 'initialCharge'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if battery exists and is available
    const battery = await Battery.findById(data.battery);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    if (battery.status !== 'available') {
      return NextResponse.json(
        { error: "Battery is not available for lease" },
        { status: 400 }
      );
    }
    
    // Create lease
    const lease = new Lease({
      ...data,
      user: decoded.userId,
      startDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Update battery status to leased
    battery.status = 'leased';
    battery.updatedAt = new Date();
    
    // Use a transaction to ensure both operations succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      await lease.save({ session });
      await battery.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
    // Populate user and battery details for response
    await lease.populate('user', 'firstName lastName email');
    await lease.populate('battery', 'serialNumber model capacity health');
    
    return NextResponse.json({ lease }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating lease:", error);
    return NextResponse.json(
      { error: "Failed to create lease" },
      { status: 500 }
    );
  }
}
