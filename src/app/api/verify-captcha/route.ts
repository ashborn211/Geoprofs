import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const captchaToken = body.token;

  if (!captchaToken) {
    return NextResponse.json({ success: false, error: "No captcha token provided" }, { status: 400 });
  }

  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ success: false, error: "Missing hCaptcha secret key" }, { status: 500 });
  }

  const verifyUrl = `https://hcaptcha.com/siteverify?secret=${secretKey}&response=${captchaToken}`;
  
  const verifyResponse = await fetch(verifyUrl, {
    method: 'POST',
  });

  const verifyData = await verifyResponse.json();

  if (verifyData.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: "Captcha verification failed" }, { status: 400 });
  }
}
