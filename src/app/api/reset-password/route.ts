// src/app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '../../../utils/auth';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    await sendResetPasswordEmail(email);
    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email', error }, { status: 500 });
  }
}