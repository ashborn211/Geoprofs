import { NextApiRequest, NextApiResponse } from "next";
import * as speakeasy from "speakeasy";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Missing email or code" });
    }

    // Fetch the user's TOTP secret from Firestore
    const userRef = doc(db, "users", email); // Assuming email is used as the Firestore document ID
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userDoc.data();
    const userTOTPSecret = userData?.totpSecret;

    if (!userTOTPSecret) {
      return res.status(400).json({ success: false, message: "TOTP not set up for this user" });
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: userTOTPSecret,
      encoding: "base32",
      token: code,
      window: 1, // Allows a window of 30 seconds before/after the current time
    });

    if (verified) {
      return res.status(200).json({ success: true, message: "TOTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid TOTP code" });
    }
  } catch (error) {
    console.error("Error verifying TOTP:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
