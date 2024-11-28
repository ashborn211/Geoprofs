"use client";
import { useState } from "react";
import ReactQR from "react-qr-code";
import { useUser } from "@/context/UserContext";

const Enable2FA = () => {
  const { user, isLoading } = useUser();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>You must be logged in to enable 2FA.</div>;

  const handleGenerate2FA = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok)
        throw new Error("Failed to generate 2FA. Please try again.");
      const data = await response.json();

      if (data.otpauthUrl && data.secret) {
        setQrCodeUrl(data.otpauthUrl);
        setSecret(data.secret);

        await fetch("/api/set-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, is2FAEnabled: true }),
        });
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Enable 2FA</h2>
      <button onClick={handleGenerate2FA} disabled={isSubmitting}>
        {isSubmitting ? "Generating..." : "Generate 2FA QR Code"}
      </button>

      {error && <p className="error">{error}</p>}
      {qrCodeUrl && (
        <div>
          <h3>Scan the QR code with your authenticator app</h3>
          <ReactQR value={qrCodeUrl} size={256} />
        </div>
      )}
    </div>
  );
};

export default Enable2FA;
