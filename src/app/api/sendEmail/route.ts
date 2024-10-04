import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { to, subject, text } = await req.json();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com
    port: 587, // Use 465 for SSL
    secure: false, // Use true for SSL
    auth: {
      user: process.env.EMAIL_USER, // Your email from environment variables
      pass: process.env.EMAIL_PASS, // Your password from environment variables
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    // Type assertion to handle the error
    const errorMessage = (error as { message?: string }).message || 'Error sending email';
    console.error('Error sending email:', error); // Log the detailed error
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
