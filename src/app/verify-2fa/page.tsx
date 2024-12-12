'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // Gebruik next/navigation voor de nieuwe App Router

const Verify2FAPage = () => {
  const [totpCode, setTotpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!totpCode) {
      alert("Please enter the 2FA code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify-totp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totpCode,
          userId: "user-id-here", // Gebruik de juiste userId
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "2FA verification failed.");
      } else {
        // Als de verificatie succesvol is
        router.push("/home");
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      alert("2FA verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Two-Factor Authentication</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          placeholder="Enter 2FA code"
          required
        />
        <button type="submit" disabled={isSubmitting}>Verify</button>
      </form>
    </div>
  );
};

export default Verify2FAPage;
