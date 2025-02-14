"use client";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  handleSendVerification,
  handleConfirmVerification,
} from "@/utils/emailVerificationUtils";

type VerifyEmailFormProps = {
  onClose: () => void; // Callback to handle closing the form
};

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Verify Email</h2>

        {userEmail && (
          <p className="mb-4">
            Current Email: <strong>{userEmail}</strong>
          </p>
        )}

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

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              handleSendVerification(setMessage, setError, setIsLoading)
            }
            className={`w-full bg-blue-500 text-white py-2 rounded transition ${
              isLoading ? "cursor-not-allowed bg-blue-300" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send Verification Email"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleConfirmVerification(
                verificationCode,
                setMessage,
                setError,
                setIsLoading,
                setVerificationCode
              )
            }
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

        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
