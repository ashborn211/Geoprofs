// app/api/verify-otp/route.ts

import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { authenticator } from "otplib"; // otplib for OTP generation and validation

// Initialize Firebase Admin SDK if not initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function POST(req: Request) {
  const { uid, otp } = await req.json();

  if (!uid || !otp) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    // Fetch the user data from Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const userData = userDoc.data();

    if (!userData?.otpauthSecret) {
      return NextResponse.json({ message: "No OTP secret found for this user." }, { status: 400 });
    }

    // Validate OTP using the user's stored secret
    const isValidOtp = authenticator.verify({ token: otp, secret: userData.otpauthSecret });

    if (isValidOtp) {
      // OTP is valid, update user data to enable 2FA
      await db.collection("users").doc(uid).update({
        is2FAEnabled: true,
      });

      return NextResponse.json({ message: "2FA enabled successfully" });
    } else {
      return NextResponse.json({ message: "Invalid OTP. Please try again." }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
