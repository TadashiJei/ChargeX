import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/auth";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await connectDB();

    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      country,
      region,
      zipCode,
    } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      country,
      region,
      zipCode,
      verificationToken,
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isVerified: process.env.NODE_ENV === 'development' // Auto-verify in development
    });

    // Try to send verification email, but don't block registration if it fails
    try {
      await sendVerificationEmail(email, firstName, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        // In development, provide verification token for testing
        ...(process.env.NODE_ENV === 'development' && { verificationToken })
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
