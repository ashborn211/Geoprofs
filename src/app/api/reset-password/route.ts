// app/api/reset-password/route.ts

import { sendResetPasswordEmail } from "@/utils/auth"; // Adjust the import path if needed
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
  }

  try {
    const response = await sendResetPasswordEmail(email);
    if (response.success) {
      return NextResponse.json({ success: true, message: response.message });
    } else {
      return NextResponse.json({ success: false, message: response.message }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
