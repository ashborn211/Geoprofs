// src/utils/auth.ts
import { auth } from '@/FireBase/FireBaseConfig'; // Adjust the path as necessary
import { sendPasswordResetEmail } from "firebase/auth";

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error; // Rethrow the error for handling in the calling component
  }
};