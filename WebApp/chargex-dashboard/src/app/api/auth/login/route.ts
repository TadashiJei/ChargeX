import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken, generateOTP, sendOTPEmail } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // Get device and location info from request headers
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'Unknown Location';

    // Handle MFA if enabled
    if (user.isMFAEnabled) {
      const otp = generateOTP();
      user.mfaSecret = otp;
      user.mfaSecretExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await user.save();

      await sendOTPEmail(email, user.firstName, otp);

      return NextResponse.json(
        {
          message: "Please enter the OTP sent to your email",
          requireMFA: true,
          userId: user._id,
        },
        { status: 200 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Update last login and send notification
    user.lastLogin = new Date();
    await user.save();

    // Send login notification
    try {
      await sendLoginNotification(
        email,
        user.firstName,
        ipAddress,
        userAgent
      );
    } catch (error) {
      console.error('Error sending login notification:', error);
      // Don't fail the login if notification fails
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
}
