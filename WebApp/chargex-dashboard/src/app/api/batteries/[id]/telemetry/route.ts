import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Battery from "@/models/Battery";
import BatteryTelemetry from "@/models/BatteryTelemetry";
import { verifyToken } from "@/lib/auth";

// Get telemetry data for a specific battery
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
    
    // Get the latest telemetry data for the battery
    const telemetry = await BatteryTelemetry.findOne(
      { batteryId },
      {},
      { sort: { timestamp: -1 } }
    );
    
    if (!telemetry) {
      return NextResponse.json(
        { error: "No telemetry data found for this battery" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ telemetry });
  } catch (error) {
    console.error("Error fetching battery telemetry:", error);
    return NextResponse.json(
      { error: "Failed to fetch battery telemetry" },
      { status: 500 }
    );
  }
}

// Create new telemetry data for a battery
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
    
    // Create new telemetry record
    const telemetry = new BatteryTelemetry({
      batteryId,
      serialNumber: battery.serialNumber,
      chargeLevel: body.chargeLevel,
      temperature: body.temperature,
      voltage: body.voltage,
      current: body.current,
      power: body.power,
      health: body.health,
      status: body.status,
      timestamp: new Date()
    });
    
    await telemetry.save();
    
    // Update battery's current charge level and status
    battery.chargeLevel = body.chargeLevel;
    battery.status = body.status;
    battery.lastUpdated = new Date();
    await battery.save();
    
    // Broadcast telemetry update via WebSocket
    // This would be implemented in a production environment
    
    return NextResponse.json({ telemetry });
  } catch (error) {
    console.error("Error creating battery telemetry:", error);
    return NextResponse.json(
      { error: "Failed to create battery telemetry" },
      { status: 500 }
    );
  }
}
