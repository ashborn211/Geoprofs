import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';

// Backend route to verify the OTP submitted by the user
export async function POST(req: Request) {
  const { otp, secret } = await req.json();

  if (!otp || !secret) {
    return NextResponse.json({ message: 'OTP and secret are required' }, { status: 400 });
  }

  // Verify the OTP
  const isValid = authenticator.verify({ token: otp, secret });

  if (isValid) {
    return NextResponse.json({ message: 'OTP is valid' });
  } else {
    return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
  }
}
