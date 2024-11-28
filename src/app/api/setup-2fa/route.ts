import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate a secret key for 2FA
  const secret = speakeasy.generateSecret({ name: `geoprofs (${email})` });

  // Create a QR code URL to be used in Google Authenticator
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: email,
    algorithm: 'sha1',
    counter: 0,
  });

  return NextResponse.json({ otpauthUrl });
}
