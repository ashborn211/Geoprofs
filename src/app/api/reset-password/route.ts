// app/api/reset-password/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Add logic to handle password reset here
    // Example: await sendResetPasswordEmail(email);

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending password reset email' }, { status: 500 });
  }
}
