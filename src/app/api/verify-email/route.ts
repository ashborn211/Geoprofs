// src/app/api/verify-email/route.ts
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    await sendVerificationEmail(email, password);
    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ message: 'Error sending verification email', error }, { status: 500 });
  }
}
