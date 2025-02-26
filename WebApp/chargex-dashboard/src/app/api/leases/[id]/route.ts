import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lease from "@/models/Lease";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Get a specific lease by ID
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
    
    const lease = await Lease.findById(params.id)
      .populate('user', 'firstName lastName email')
      .populate('battery', 'serialNumber model capacity health status');
    
    if (!lease) {
      return NextResponse.json(
        { error: "Lease not found" },
        { status: 404 }
      );
    }
    
    // Regular users can only see their own leases
    if (decoded.role !== 'admin' && lease.user._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ lease }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lease:", error);
    return NextResponse.json(
      { error: "Failed to fetch lease" },
      { status: 500 }
    );
  }
}

// Update a lease (return a battery)
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
    
    // Find the lease
    const lease = await Lease.findById(params.id);
    
    if (!lease) {
      return NextResponse.json(
        { error: "Lease not found" },
        { status: 404 }
      );
    }
    
    // Regular users can only update their own leases
    if (decoded.role !== 'admin' && lease.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // If returning a battery
    if (data.status === 'completed' && lease.status === 'active') {
      if (!data.returnCharge) {
        return NextResponse.json(
          { error: "Return charge is required" },
          { status: 400 }
        );
      }
      
      // Find the battery
      const battery = await Battery.findById(lease.battery);
      
      if (!battery) {
        return NextResponse.json(
          { error: "Battery not found" },
          { status: 404 }
        );
      }
      
      // Update battery status to available and set current charge
      battery.status = 'available';
      battery.currentCharge = data.returnCharge;
      battery.updatedAt = new Date();
      
      // Update lease
      lease.status = 'completed';
      lease.returnCharge = data.returnCharge;
      lease.updatedAt = new Date();
      
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
      
      return NextResponse.json({ lease }, { status: 200 });
    }
    
    // For other updates (admin only)
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required for this update" },
        { status: 403 }
      );
    }
    
    // Update lease
    Object.assign(lease, {
      ...data,
      updatedAt: new Date(),
    });
    
    await lease.save();
    
    // Populate user and battery details for response
    await lease.populate('user', 'firstName lastName email');
    await lease.populate('battery', 'serialNumber model capacity health');
    
    return NextResponse.json({ lease }, { status: 200 });
  } catch (error) {
    console.error("Error updating lease:", error);
    return NextResponse.json(
      { error: "Failed to update lease" },
      { status: 500 }
    );
  }
}

// Cancel a lease (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Verify authentication and authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    
    // Find the lease
    const lease = await Lease.findById(params.id);
    
    if (!lease) {
      return NextResponse.json(
        { error: "Lease not found" },
        { status: 404 }
      );
    }
    
    // Only active leases can be cancelled
    if (lease.status !== 'active') {
      return NextResponse.json(
        { error: "Only active leases can be cancelled" },
        { status: 400 }
      );
    }
    
    // Find the battery
    const battery = await Battery.findById(lease.battery);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    // Update battery status to available
    battery.status = 'available';
    battery.updatedAt = new Date();
    
    // Update lease status to cancelled
    lease.status = 'cancelled';
    lease.updatedAt = new Date();
    
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
    
    return NextResponse.json(
      { message: "Lease cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling lease:", error);
    return NextResponse.json(
      { error: "Failed to cancel lease" },
      { status: 500 }
    );
  }
}
