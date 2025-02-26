import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BatteryAlert from "@/models/BatteryAlert";
import { verifyToken } from "@/lib/auth";

// Acknowledge an alert
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
    
    const alertId = params.id;
    
    // Find and update the alert
    const alert = await BatteryAlert.findById(alertId);
    
    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }
    
    alert.acknowledged = true;
    await alert.save();
    
    return NextResponse.json({ 
      success: true,
      alert
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge alert" },
      { status: 500 }
    );
  }
}
