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
    alert('Password reset email sent! Check your inbox.');
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    alert(error.message || 'Failed to send reset email. Please try again.');
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
      alert('Verification email sent! Please check your inbox.');
    }
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    alert(error.message || 'Failed to send verification email. Please try again.');
  }
};
