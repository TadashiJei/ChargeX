import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";

// Get a specific battery by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const battery = await Battery.findById(params.id);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ battery }, { status: 200 });
  } catch (error) {
    console.error("Error fetching battery:", error);
    return NextResponse.json(
      { error: "Failed to fetch battery" },
      { status: 500 }
    );
  }
}

// Update a battery (admin only)
export async function PUT(
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
    
    const data = await request.json();
    
    // Find and update battery
    const battery = await Battery.findByIdAndUpdate(
      params.id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ battery }, { status: 200 });
  } catch (error) {
    console.error("Error updating battery:", error);
    return NextResponse.json(
      { error: "Failed to update battery" },
      { status: 500 }
    );
  }
}

// Delete a battery (admin only)
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
    
    // Find and delete battery
    const battery = await Battery.findByIdAndDelete(params.id);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Battery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting battery:", error);
    return NextResponse.json(
      { error: "Failed to delete battery" },
      { status: 500 }
    );
  }
}
