import { auth } from "../../../FireBaseConfig";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FormEvent } from "react";

// Function to reset the password
const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to", email);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error sending password reset email:", errorCode, errorMessage);
  }
};

// Example usage in a component
const ResetPasswordForm: React.FC = () => {
  const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.email as HTMLInputElement).value; // Get the email from your form
    resetPassword(email);
  };

  return (
    <form onSubmit={handleResetPassword}>
      <input type="email" name="email" placeholder="Enter your email" required />
      <button type="submit">Send Password Reset Email</button>
    </form>
  );
};

export default ResetPasswordForm;
