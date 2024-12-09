"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button } from "@nextui-org/react";

const TwoFactorAuthPage = () => {
  const [totpCode, setTotpCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const handleVerify = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verifyTOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: totpCode }),
      });

      const result = await response.json();

      if (result.success) {
        alert("2FA verification successful!");
        router.push("/home");
      } else {
        alert("Invalid 2FA code. Please try again.");
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8">
        <h2 className="text-center text-2xl font-semibold mb-8">
          Voer de 2FA-code in
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <Input
            type="text"
            placeholder="Authenticator Code"
            value={totpCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTotpCode(e.target.value)
            }
            required
          />
          <Button
            color="primary"
            onClick={handleVerify}
            disabled={isSubmitting}
          >
            Verifiëren
          </Button>
        </div>
      </div>
    </main>
  );
};

export default TwoFactorAuthPage;
