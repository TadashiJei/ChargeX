import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EnergyTrade from "@/models/EnergyTrade";
import { verifyToken } from "@/lib/auth";

// Cancel an energy trade
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
    
    const userId = decoded.userId;
    const tradeId = params.id;
    
    // Find the trade
    const trade = await EnergyTrade.findById(tradeId);
    
    if (!trade) {
      return NextResponse.json(
        { error: "Trade not found" },
        { status: 404 }
      );
    }
    
    // Check if trade is still open
    if (trade.status !== 'open') {
      return NextResponse.json(
        { error: "This trade cannot be cancelled because it is not open" },
        { status: 400 }
      );
    }
    
    // Check if user is the seller
    if (trade.sellerId.toString() !== userId) {
      return NextResponse.json(
        { error: "You can only cancel your own trades" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Update trade status to cancelled
    trade.status = 'cancelled';
    
    if (body.transactionHash) {
      trade.transactionHash = body.transactionHash;
    }
    
    await trade.save();
    
    // Broadcast trade update via WebSocket
    // This would be implemented in a production environment
    
    return NextResponse.json({ 
      success: true,
      trade
    });
  } catch (error) {
    console.error("Error cancelling trade:", error);
    return NextResponse.json(
      { error: "Failed to cancel trade" },
      { status: 500 }
    );
  }
}
