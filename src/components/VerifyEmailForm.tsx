"use client";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const VerifyEmailForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store user email
  const [isLoading, setIsLoading] = useState(false); // Loading state for feedback
  const [verificationCode, setVerificationCode] = useState(""); // Store verification code

  // Get the current user's email when the component mounts
  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set the email if user is authenticated
    }
  }, []);

  const handleSendVerification = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const currentUser = getAuth().currentUser;

      if (currentUser) {
        const idToken = await currentUser.getIdToken();

        const response = await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || "Verification email sent successfully.");
        } else {
          setError(data.error || "Failed to send verification email.");
        }
      } else {
        setError("User is not authenticated.");
      }
    } catch (err) {
      console.error("Error sending verification request:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmVerification = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/confirm-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Email successfully verified!");
        setVerificationCode("");
      } else {
        setError(data.error || "Failed to verify email.");
      }
    } catch (err) {
      console.error("Error confirming verification:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Verify Email</h2>

        {/* Display the current user's email */}
        {userEmail && (
          <p className="mb-4">
            Current Email: <strong>{userEmail}</strong>
          </p>
        )}

        {/* Verification Code Input */}
        <label
          htmlFor="verificationCode"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Verification Code (if available)
        </label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter verification code"
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSendVerification}
            className={`w-full bg-blue-500 text-white py-2 rounded transition ${
              isLoading ? "cursor-not-allowed bg-blue-300" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send Verification Email"}
          </button>

          <button
            type="button"
            onClick={handleConfirmVerification}
            className={`w-full bg-green-500 text-white py-2 rounded transition ${
              isLoading || !verificationCode
                ? "cursor-not-allowed bg-green-300"
                : "hover:bg-green-600"
            }`}
            disabled={isLoading || !verificationCode}
          >
            {isLoading ? "Processing..." : "Confirm Verification Code"}
          </button>
        </div>

        {/* Feedback Messages */}
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyEmailForm;
