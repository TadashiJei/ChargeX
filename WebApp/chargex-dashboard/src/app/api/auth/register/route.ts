import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      country,
      region,
      zipCode,
      phoneNumber,
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      country,
      region,
      zipCode,
      phoneNumber,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    await sendVerificationEmail(email, firstName, verificationToken);

    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error creating account" },
      { status: 500 }
    );
  }
}
