import { getAuth } from "firebase/auth";

export const handleSendVerification = async (
  setMessage: (message: string) => void,
  setError: (error: string) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // Reset state before starting
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

export const handleConfirmVerification = async (
  verificationCode: string,
  setMessage: (message: string) => void,
  setError: (error: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setVerificationCode: (code: string) => void
) => {
  // Reset state before starting
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
      setVerificationCode(""); // Reset the verification code
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
