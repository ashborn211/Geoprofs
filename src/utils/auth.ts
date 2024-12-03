// utils/auth.ts

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/FireBase/FireBaseConfig";

export const sendResetPasswordEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to send password reset email. Please try again." };
  }
};
