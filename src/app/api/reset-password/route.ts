import { NextApiRequest, NextApiResponse } from "next";
import { sendResetPasswordEmail } from "@/utils/auth"; // Path to the auth.ts utility

// API handler for sending the password reset email
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    try {
      await sendResetPasswordEmail(email); // Send the reset password email using the function from auth.ts
      return res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
      return res.status(500).json({ message: "Error sending password reset email." });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
