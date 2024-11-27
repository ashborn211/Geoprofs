"use client";
import { useState } from "react";
import QRCode from "qrcode.react";

const Enable2FA = () => {
  const [email, setEmail] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate2FA = async () => {
    setIsLoading(true);

    const response = await fetch("/api/generate-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.otpauthUrl) {
      setQrCodeUrl(data.otpauthUrl);
      setSecret(data.secret); // You need to store this secret for verifying the OTP later
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <h2>Enable 2FA</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={handleGenerate2FA} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate 2FA QR Code"}
      </button>

      {qrCodeUrl && (
        <div>
          <h3>Scan the QR code with your authenticator app</h3>
          <QRCode value={qrCodeUrl} size={256} />
        </div>
      )}
    </div>
  );
};

export default Enable2FA;
