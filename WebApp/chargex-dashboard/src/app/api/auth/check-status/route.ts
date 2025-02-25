import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    console.log('Checking status for user:', email, user ? 'Found' : 'Not found');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: user.email,
      isVerified: user.isVerified,
      isMFAEnabled: user.isMFAEnabled,
      firstName: user.firstName,
      lastName: user.lastName,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check user status' },
      { status: 500 }
    );
  }
}
