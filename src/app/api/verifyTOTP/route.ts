// app/api/verify-totp/route.ts
import { NextResponse } from "next/server";
import { validateTOTP } from "@/utils/totp"; 
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig"; 

const getUserTotpSecret = async (userId: string): Promise<string | null> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().totpSecret || null;
  } else {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const { totpCode, userId } = await req.json();

    if (!totpCode || !userId) {
      return NextResponse.json({ error: "Missing totpCode or userId" }, { status: 400 });
    }

    const secret = await getUserTotpSecret(userId);

    if (!secret) {
      return NextResponse.json({ error: "No TOTP secret found for user" }, { status: 400 });
    }

    const isValid = validateTOTP(secret, totpCode);

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Invalid 2FA code." }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json({ error: "Server error during 2FA verification." }, { status: 500 });
  }
}
