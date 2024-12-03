"use client";
import { useState, useEffect } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { auth } from "@/FireBase/FireBaseConfig"; // Your Firebase config

const VerifyEmailForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store user email

  // Get the current user's email when the component mounts
  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set the email if user is authenticated
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const currentUser = getAuth().currentUser;

      if (currentUser) {
        // Send email verification directly on the client side
        await sendEmailVerification(currentUser);

        // Provide feedback to the user
        setMessage("Verification email sent successfully. Please check your inbox.");
      } else {
        setError("User is not authenticated.");
      }
    } catch (err) {
      console.error("Error sending verification request:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-lg font-semibold mb-4">Verify Email</h2>

        {/* Display the current user's email */}
        {userEmail && (
          <p className="mb-4">Current Email: <strong>{userEmail}</strong></p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Send Verification Email
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyEmailForm;
