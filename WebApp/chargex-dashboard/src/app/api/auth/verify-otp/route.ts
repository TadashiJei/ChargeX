import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, otp } = await request.json();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Validate OTP
    if (!user.mfaSecret || !user.mfaSecretExpiry) {
      return NextResponse.json(
        { message: "No OTP request found" },
        { status: 400 }
      );
    }

    if (new Date() > user.mfaSecretExpiry) {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    if (user.mfaSecret !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 401 }
      );
    }

    // Clear MFA secret
    user.mfaSecret = undefined;
    user.mfaSecretExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Set HTTP-only cookie with JWT
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
