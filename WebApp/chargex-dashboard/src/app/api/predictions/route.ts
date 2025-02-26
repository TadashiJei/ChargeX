import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AIPrediction from "@/models/AIPrediction";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";
import { rivalzApiService } from "@/services/rivalz-api";

// Get AI predictions with optional filtering
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
    const predictionType = searchParams.get('type');
    const minConfidence = searchParams.get('minConfidence');
    const limit = searchParams.get('limit') || '10';
    
    // Build query
    const query: any = {};
    
    if (batteryId) query.battery = batteryId;
    if (predictionType) query.predictionType = predictionType;
    if (minConfidence) query.confidence = { $gte: parseFloat(minConfidence) };
    
    const predictions = await AIPrediction.find(query)
      .populate('battery', 'serialNumber model capacity health')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    return NextResponse.json({ predictions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching AI predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI predictions" },
      { status: 500 }
    );
  }
}

// Request a new AI prediction for a battery
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
    if (!data.battery || !data.predictionType) {
      return NextResponse.json(
        { error: "Battery ID and prediction type are required" },
        { status: 400 }
      );
    }
    
    // Check if battery exists
    const battery = await Battery.findById(data.battery);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    // Request prediction from Rivalz API
    try {
      const predictionResult = await rivalzApiService.requestPrediction({
        batteryId: battery._id.toString(),
        serialNumber: battery.serialNumber,
        predictionType: data.predictionType,
        additionalParams: data.additionalParams || {},
      });
      
      // Create prediction record
      const prediction = new AIPrediction({
        battery: data.battery,
        predictionType: data.predictionType,
        confidence: predictionResult.confidence,
        predictedValue: predictionResult.predictedValue,
        recommendations: predictionResult.recommendations,
        createdAt: new Date(),
      });
      
      await prediction.save();
      
      // Populate battery details for response
      await prediction.populate('battery', 'serialNumber model capacity health');
      
      return NextResponse.json({ prediction }, { status: 201 });
    } catch (apiError: any) {
      console.error("Error from Rivalz API:", apiError);
      return NextResponse.json(
        { error: apiError.message || "Failed to get prediction from AI service" },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Error requesting AI prediction:", error);
    return NextResponse.json(
      { error: "Failed to request AI prediction" },
      { status: 500 }
    );
  }
}
