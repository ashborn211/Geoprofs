import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';

// Backend route to generate the 2FA secret and URL
export async function POST(req: Request) {
  const { email } = await req.json(); // Get the user's email from the request body

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  // Generate a new secret key for 2FA
  const secret = authenticator.generateSecret();

  // Generate a URL for the authenticator app (e.g., Google Authenticator)
  const otpauthUrl = authenticator.keyuri(email, 'GeoProfsApp', secret);

  return NextResponse.json({ secret, otpauthUrl });
}
