"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Input, Button } from "@nextui-org/react";
import { useUser } from "../context/UserContext";
import { db, auth } from "@/FireBase/FireBaseConfig";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { authenticator } from "otplib";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [totpCode, setTotpCode] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
        const { totpSecret } = userData;

        if (totpSecret) {
          // 2FA is enabled, validate the TOTP code
          if (!totpCode) {
            alert("Please enter the 2FA code.");
            setIsSubmitting(false);
            return;
          }

          const isTotpValid = authenticator.verify({
            token: totpCode,
            secret: totpSecret,
          });

          if (!isTotpValid) {
            alert("Invalid 2FA code. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }

        // Set user in context
        setUser({
          uid: user.uid,
          email: user.email!,
          userName: userData.userName || "Anonymous",
          role: userData.role,
          team: userData.team,
        });

        alert("Login successful!");
        router.push("/home");
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
    <main className="relative h-screen w-screen bg-cover bg-center bg-no-repeat">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('/images/the_starry_night.jpg')] brightness-50"></div>

      {/* Layout container */}
      <div className="flex items-center justify-start h-full relative">
        {/* Image field centered on the right-hand side */}
        <div className="absolute top-1/2 right-64 transform -translate-y-1/2">
          <img
            src="/images/Logo GeoProfs letter.png"
            alt="Right-Side Image"
            className="h-30 w-100"
          />
        </div>

        {/* Login block pushed to the left */}
        <div className="bg-black bg-opacity-40 shadow-md w-2/4 h-full p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <img
              src="/images/Logo GeoProfs.png"
              alt="GeoProfs Logo"
              className="mx-auto h-32"
            />
          </div>
          <h2 className="text-center text-2xl font-semibold mb-8 text-white">
            Inloggen
          </h2>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="w-2/4">
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
            <div className="w-2/4">
              <Input
                type="password"
                placeholder="****"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full"
              />
            </div>
            <div className="w-2/4">
              <Input
                type="text"
                placeholder="2FA Code"
                value={totpCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTotpCode(e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="w-2/4">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={handleCaptchaChange}
              />
            </div>
            <div className="w-2/4">
              <Button
                type="submit"
                className="w-full"
                color="primary"
                disabled={isSubmitting}
              >
                Inloggen
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
