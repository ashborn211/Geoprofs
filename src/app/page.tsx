"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../FireBase/FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Input, Button } from "@nextui-org/react";
import { useUser } from "../context/UserContext";
import { db } from "@/FireBase/FireBaseConfig";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { QRCode } from "qrcode.react";
import "./page.css";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // To hold the QR Code URL
  const { setUser } = useUser();
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error("No such user document");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      setIsSubmitting(false);
      return;
    }

    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      setIsSubmitting(false);
      return;
    }

    // Verify CAPTCHA token on the server
    const captchaResponse = await fetch("/api/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      alert("CAPTCHA verification failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Your email is not verified. You may continue using the app.");
      }

      const userData = await fetchUserData(user.uid);

      if (userData) {
        setUser({
          uid: user.uid,
          email: user.email!,
          userName: userData.userName || "Anonymous", // Use userName from Firestore
          role: userData.role,
          team: userData.team,
        });

        // Check if 2FA is enabled
        if (userData.is2FAEnabled) {
          // 2FA is enabled, show QR Code for authentication
          const otpauthUrl = userData.otpauthUrl || ""; // Get OTP URL from Firestore (you should store this when enabling 2FA)
          setQrCodeUrl(otpauthUrl);
          router.push("/home");
        } else {
          // If 2FA is not enabled, proceed to home page
          alert("Login successful!");
          router.push("/setting/enable-2fa");
        }
      } else {
        alert("Failed to fetch user details. Please try again.");
      }
    } catch (error: any) {
      console.error(error.message);
      if (error.code === "auth/user-not-found") {
        alert("User does not exist. Do you want to register?");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="logo-container">
        <img
          src="/images/Logo GeoProfs.png"
          alt="GeoProfs Logo"
          className="logo"
        />
      </div>
      <div className="container">
        <h2 className="title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <Input
              type="email"
              placeholder="E-mail..."
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              fullWidth
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              placeholder="****"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              fullWidth
            />
          </div>

          <div className="form-group">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!} // hCaptcha site key
              onVerify={handleCaptchaChange} // Callback function for token
            />
          </div>

          <div className="button-group">
            <Button
              type="submit"
              className="login-button"
              color="primary"
              disabled={isSubmitting} // Disable the button while submitting
            >
              Inloggen
            </Button>
          </div>
        </form>

        {/* Display the QR code if 2FA is enabled */}
        {qrCodeUrl && (
          <div>
            <h3>Scan the QR code with your authenticator app</h3>
            <QRCode value={qrCodeUrl} size={256} />
          </div>
        )}
      </div>
    </main>
  );
};

export default LoginPage;
