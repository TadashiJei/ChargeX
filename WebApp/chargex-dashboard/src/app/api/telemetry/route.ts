import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Telemetry from "@/models/Telemetry";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import { rivalzApiService } from "@/services/rivalz-api";

// Get telemetry data with optional filtering
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
    const batteryId = searchParams.get('batteryId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') || '100';
    
    // Validate required parameters
    if (!batteryId) {
      return NextResponse.json(
        { error: "Battery ID is required" },
        { status: 400 }
      );
    }
    
    // Build query
    const query: any = { battery: batteryId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const telemetryData = await Telemetry.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    return NextResponse.json({ telemetryData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching telemetry data:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry data" },
      { status: 500 }
    );
  }
}

// Record new telemetry data (from IoT devices or admin)
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
    
    // Only admin or IoT device role can post telemetry data
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'device')) {
      return NextResponse.json(
        { error: "Unauthorized - Insufficient permissions" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['battery', 'voltage', 'current', 'temperature', 'chargeLevel'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if battery exists
    const battery = await Battery.findById(data.battery);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    // Create telemetry record
    const telemetry = new Telemetry({
      ...data,
      timestamp: data.timestamp || new Date(),
    });
    
    // Check for alerts based on telemetry data
    const alerts = [];
    
    // Temperature alert
    if (data.temperature > 45) {
      alerts.push({
        type: 'temperature',
        severity: data.temperature > 60 ? 'critical' : 'warning',
        message: `High temperature detected: ${data.temperature}°C`,
      });
    }
    
    // Voltage alert
    if (data.voltage < battery.minVoltage || data.voltage > battery.maxVoltage) {
      alerts.push({
        type: 'voltage',
        severity: 'warning',
        message: `Abnormal voltage: ${data.voltage}V`,
      });
    }
    
    // Current alert
    if (data.current < 0 && Math.abs(data.current) > battery.maxDischargeCurrent) {
      alerts.push({
        type: 'current',
        severity: 'warning',
        message: `High discharge current: ${Math.abs(data.current)}A`,
      });
    } else if (data.current > battery.maxChargeCurrent) {
      alerts.push({
        type: 'current',
        severity: 'warning',
        message: `High charge current: ${data.current}A`,
      });
    }
    
    // Add alerts if any
    if (alerts.length > 0) {
      telemetry.alerts = alerts;
    }
    
    await telemetry.save();
    
    // Update battery's current charge level
    battery.currentCharge = data.chargeLevel;
    battery.updatedAt = new Date();
    await battery.save();
    
    // Send telemetry data to Rivalz API for AI analysis
    try {
      await rivalzApiService.sendTelemetryData({
        batteryId: battery._id.toString(),
        serialNumber: battery.serialNumber,
        timestamp: telemetry.timestamp,
        voltage: telemetry.voltage,
        current: telemetry.current,
        temperature: telemetry.temperature,
        chargeLevel: telemetry.chargeLevel,
        alerts: telemetry.alerts || [],
      });
    } catch (apiError) {
      console.error("Failed to send telemetry to Rivalz API:", apiError);
      // Continue execution even if Rivalz API call fails
    }
    
    return NextResponse.json({ telemetry }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording telemetry data:", error);
    return NextResponse.json(
      { error: "Failed to record telemetry data" },
      { status: 500 }
    );
  }
}
