// src/app/api/verify-email/route.ts

import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/auth'; // Ensure correct path

export async function POST(request: Request) {
  console.log("Received POST request for verify-email");

  try {
    // Parse the email from the request body
    const { email } = await request.json();

    // Call the helper function to send the verification email
    await sendVerificationEmail(email);
    
    return NextResponse.json({ message: 'Verification email sent.' });
  } catch (error: any) {
    console.error('Error in sending email:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
