import { auth } from '../FireBase/FireBaseConfig'; // Adjust the path as necessary
import { sendPasswordResetEmail, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/FireBase/firebaseAdmin'; // Ensure correct path
/**
 * Sends a password reset email to the provided email address.
 * @param email - The email address to send the reset email to.
 */
export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent.');
    alert('Password reset email sent! Check your inbox.');
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    alert(error.message || 'Failed to send reset email. Please try again.');
  }
};

// src/utils/auth.ts



/**
 * Sends a verification email to a specific user.
 * @param email - The user's email address.
 */
export const sendVerificationEmail = async (email: string): Promise<void> => {
  try {
    // Use Firebase Admin SDK to get the user by email
    const userRecord = await auth.getUserByEmail(email);
    
    if (userRecord) {
      // Send verification email to the user
      await sendEmailVerification(userRecord);
      console.log('Verification email sent.');
    } else {
      throw new Error('User not found');
    }
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    throw new Error(error.message || 'Failed to send verification email.');
  }
};
