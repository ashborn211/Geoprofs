"use client"
import { useState } from 'react';
import ReactQR from 'react-qr-code';

export default function Setup2FA() {
  const [email, setEmail] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/setup-2fa', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.otpauthUrl) {
      setQrCodeUrl(data.otpauthUrl);
    } else {
      alert('Error: ' + data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Generate QR Code
        </button>
      </form>

      {qrCodeUrl && (
        <div className="mt-4">
          <h2 className="text-xl">Scan with Google Authenticator</h2>
          <ReactQR value={qrCodeUrl} size={256} />
        </div>
      )}
    </div>
  );
}
