import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Battery from "@/models/Battery";
import { verifyToken } from "@/lib/auth";

// Get all batteries with optional filtering
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const model = searchParams.get('model');
    const minCapacity = searchParams.get('minCapacity');
    const maxCapacity = searchParams.get('maxCapacity');
    const minHealth = searchParams.get('minHealth');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius'); // in kilometers
    
    // Build query
    const query: any = {};
    
    if (status) query.status = status;
    if (model) query.model = model;
    if (minCapacity) query.capacity = { $gte: parseFloat(minCapacity) };
    if (maxCapacity) {
      if (query.capacity) {
        query.capacity.$lte = parseFloat(maxCapacity);
      } else {
        query.capacity = { $lte: parseFloat(maxCapacity) };
      }
    }
    if (minHealth) query.health = { $gte: parseFloat(minHealth) };
    
    // Geospatial query if lat, lng and radius are provided
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // convert to meters
        },
      };
    }
    
    const batteries = await Battery.find(query).sort({ createdAt: -1 }).limit(100);
    
    return NextResponse.json({ batteries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching batteries:", error);
    return NextResponse.json(
      { error: "Failed to fetch batteries" },
      { status: 500 }
    );
  }
}

// Create a new battery (admin only)
export async function POST(request: Request) {
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
    
    // Validate required fields
    const requiredFields = ['serialNumber', 'model', 'capacity', 'currentCharge', 'health', 'manufactureDate'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create battery
    const battery = new Battery({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await battery.save();
    
    return NextResponse.json({ battery }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating battery:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Battery with this serial number already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create battery" },
      { status: 500 }
    );
  }
}
