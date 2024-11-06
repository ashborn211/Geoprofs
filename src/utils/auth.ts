// src/utils/auth.ts
import { auth } from '../FireBase/FireBaseConfig'; // Adjust the path as necessary
import { sendPasswordResetEmail } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';

const actionCodeSettings = {
  url: 'http://localhost:3000/finishSignUp', // Adjust for production
  handleCodeInApp: true,
};

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// src/utils/auth.ts

export const sendVerificationEmail = async (email: string): Promise<void> => {
  const user = auth.currentUser; // Get the current logged-in user

  if (!user || user.email !== email) {
    throw new Error("The email does not match the current logged-in user");
  }

  try {
    await sendEmailVerification(user); // Send the email verification
    console.log("Verification email sent to:", user.email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // Rethrow the error for handling
  }
};