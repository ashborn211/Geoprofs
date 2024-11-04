// src/app/api/sendVerificationEmail/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/FireBase/FireBaseConfig'; // Adjust the path as necessary
import { sendSignInLinkToEmail } from 'firebase/auth';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  // Create the action code settings for email verification
  const actionCodeSettings = {
    url: 'http://localhost:3000/finishSignUp', // Change to your verification URL
    handleCodeInApp: true,
  };

  try {
    // Send the verification email
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ message: 'Error sending verification email', error }, { status: 500 });
  }
}
