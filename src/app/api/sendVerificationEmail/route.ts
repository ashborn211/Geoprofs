// src/app/api/sendVerificationEmail/route.ts
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "../../../utils/auth"; // Your utility function

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await sendVerificationEmail(email); // Call the utility function to send verification email
    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
  }
}
