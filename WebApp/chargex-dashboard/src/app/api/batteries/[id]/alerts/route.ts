import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Battery from "@/models/Battery";
import BatteryAlert from "@/models/BatteryAlert";
import { verifyToken } from "@/lib/auth";

// Get alerts for a specific battery
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
    
    const batteryId = params.id;
    
    // Verify battery exists
    const battery = await Battery.findById(batteryId);
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    // Get alerts for the battery, sorted by timestamp (newest first)
    const alerts = await BatteryAlert.find(
      { batteryId },
      {},
      { sort: { timestamp: -1 } }
    );
    
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching battery alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch battery alerts" },
      { status: 500 }
    );
  }
}

// Create a new alert for a battery
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
    
    const batteryId = params.id;
    
    // Verify battery exists
    const battery = await Battery.findById(batteryId);
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Create new alert
    const alert = new BatteryAlert({
      batteryId,
      serialNumber: battery.serialNumber,
      type: body.type,
      severity: body.severity,
      message: body.message,
      timestamp: new Date(),
      acknowledged: false
    });
    
    await alert.save();
    
    // Broadcast alert via WebSocket
    // This would be implemented in a production environment
    
    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Error creating battery alert:", error);
    return NextResponse.json(
      { error: "Failed to create battery alert" },
      { status: 500 }
    );
  }
}
