import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import bcryptjs from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    console.log('Password valid:', isValidPassword ? 'yes' : 'no');

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('Login successful, sending user data:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
