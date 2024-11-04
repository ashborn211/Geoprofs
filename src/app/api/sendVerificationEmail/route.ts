// src/app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/FireBase/FireBaseConfig'; // Import your existing auth instance
import { sendSignInLinkToEmail } from 'firebase/auth';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    // Send the password reset email
    await sendPasswordResetEmail(auth, email);

    // Create the action code settings for email verification
    const actionCodeSettings = {
      url: 'http://localhost:3000/finishSignUp', // Change to your verification URL
      handleCodeInApp: true,
    };

    // Send the verification email
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    return NextResponse.json({ message: 'Password reset and verification emails sent' });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ message: 'Error sending email', error }, { status: 500 });
  }
}
