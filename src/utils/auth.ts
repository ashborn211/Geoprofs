import { auth } from '../FireBase/FireBaseConfig'; // Adjust the path as necessary
import { sendPasswordResetEmail, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

/**
 * Sends a password reset email to the provided email address.
 * @param email - The email address to send the reset email to.
 */
export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Sends a verification email to the user's email address after signing in.
 * @param email - The user's email address.
 * @param password - The user's password (needed to sign in before sending verification).
 */
export const sendVerificationEmail = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await sendEmailVerification(user);
      console.log('Verification email sent.');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
