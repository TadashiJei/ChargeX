import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Battery from "@/models/Battery";
import Lease from "@/models/Lease";
import EnergyTrade from "@/models/EnergyTrade";
import Telemetry from "@/models/Telemetry";
import AIPrediction from "@/models/AIPrediction";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Get dashboard overview data
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
    
    const userId = decoded.userId;
    const isAdmin = decoded.role === 'admin';
    
    // Get counts and stats
    const batteryQuery = isAdmin ? {} : { status: 'available' };
    const totalBatteries = await Battery.countDocuments(batteryQuery);
    
    const leaseQuery = isAdmin ? {} : { user: new mongoose.Types.ObjectId(userId) };
    const activeLeases = await Lease.countDocuments({ ...leaseQuery, status: 'active' });
    
    const tradeQuery = isAdmin 
      ? {} 
      : { 
          $or: [
            { seller: new mongoose.Types.ObjectId(userId) },
            { buyer: new mongoose.Types.ObjectId(userId) }
          ]
        };
    const activeTrades = await EnergyTrade.countDocuments({ ...tradeQuery, status: { $in: ['listed', 'pending'] } });
    
    // Get battery health distribution
    const batteryHealthAggregation = await Battery.aggregate([
      { $match: batteryQuery },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $gte: ["$health", 90] }, then: "excellent" },
                { case: { $gte: ["$health", 75] }, then: "good" },
                { case: { $gte: ["$health", 50] }, then: "fair" },
                { case: { $gte: ["$health", 25] }, then: "poor" }
              ],
              default: "critical"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const batteryHealthDistribution = batteryHealthAggregation.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0
    });
    
    // Get recent alerts (from telemetry)
    const recentAlertsQuery = isAdmin 
      ? { alerts: { $exists: true, $ne: [] } }
      : {
          alerts: { $exists: true, $ne: [] },
          battery: {
            $in: await Lease.find({ 
              user: new mongoose.Types.ObjectId(userId),
              status: 'active'
            }).distinct('battery')
          }
        };
    
    const recentAlerts = await Telemetry.find(recentAlertsQuery)
      .populate('battery', 'serialNumber model')
      .sort({ timestamp: -1 })
      .limit(5);
    
    // Get recent predictions
    const recentPredictionsQuery = isAdmin
      ? {}
      : {
          battery: {
            $in: await Lease.find({ 
              user: new mongoose.Types.ObjectId(userId),
              status: 'active'
            }).distinct('battery')
          }
        };
    
    const recentPredictions = await AIPrediction.find(recentPredictionsQuery)
      .populate('battery', 'serialNumber model')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get energy usage statistics (for admin or user's batteries)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const energyUsageQuery = isAdmin
      ? { timestamp: { $gte: thirtyDaysAgo } }
      : {
          timestamp: { $gte: thirtyDaysAgo },
          battery: {
            $in: await Lease.find({ 
              user: new mongoose.Types.ObjectId(userId),
              status: 'active'
            }).distinct('battery')
          }
        };
    
    const energyUsageData = await Telemetry.aggregate([
      { $match: energyUsageQuery },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" }
          },
          averageCharge: { $avg: "$chargeLevel" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 30 }
    ]);
    
    const energyUsage = energyUsageData.map(item => ({
      date: new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0],
      averageCharge: Math.round(item.averageCharge * 100) / 100,
      count: item.count
    }));
    
    // Prepare response
    const overview = {
      counts: {
        totalBatteries,
        activeLeases,
        activeTrades
      },
      batteryHealthDistribution,
      recentAlerts: recentAlerts.map(alert => ({
        id: alert._id,
        batteryId: alert.battery._id,
        batterySerial: alert.battery.serialNumber,
        batteryModel: alert.battery.model,
        timestamp: alert.timestamp,
        alerts: alert.alerts
      })),
      recentPredictions: recentPredictions.map(prediction => ({
        id: prediction._id,
        batteryId: prediction.battery._id,
        batterySerial: prediction.battery.serialNumber,
        batteryModel: prediction.battery.model,
        type: prediction.predictionType,
        confidence: prediction.confidence,
        predictedValue: prediction.predictedValue,
        recommendations: prediction.recommendations,
        createdAt: prediction.createdAt
      })),
      energyUsage
    };
    
    return NextResponse.json({ overview }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 }
    );
  }
}
