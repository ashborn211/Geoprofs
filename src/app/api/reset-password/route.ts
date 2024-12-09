// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/FireBase/FireBaseConfig';  // Adjust the import if needed



export async function POST(req: NextRequest) {
  try {
    // Get the email from the request body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    // Send the password reset email
    await sendPasswordResetEmail(auth, email);

    // Respond with success
    return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json(
      { message: 'Failed to send password reset email. Please try again.' },
      { status: 500 }
    );
  }
}