import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    console.log('Verifying email with token:', token);

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    console.log('Looking for user with token:', token);

    // Find user by verification token
    const user = await User.findOne({
      verificationToken: token,
    });

    console.log('User found:', user ? 'yes' : 'no');
    if (user) {
      console.log('Current verification status:', user.isVerified);
      console.log('Token expiry:', user.verificationExpires);
    }

    console.log('Found user:', user ? user.email : 'No user found');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.verificationExpires && new Date() > new Date(user.verificationExpires)) {
      console.log('Token expired. Expiry:', user.verificationExpires, 'Current:', new Date());
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    console.log('User verified successfully:', user.email);

    return NextResponse.json({
      message: 'Email verified successfully',
      email: user.email
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
