"use client";
// src/components/ResetPasswordForm.tsx
import { useState } from "react";

type ResetPasswordFormProps = {
  onClose: () => void; // Callback to handle closing the form
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    console.log("Form submitted with email:", email);

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error sending password reset email:", responseData);
        alert("Failed to send password reset email. Please try again.");
        return;
      }

      console.log("Password reset email sent to:", email);
      alert(responseData.message);
    } catch (err) {
      console.error("Error sending request:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send Reset Email
          </button>
        </form>
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

export default ResetPasswordForm;
