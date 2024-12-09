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

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

      // Pass user info to the 2FA page
      router.push(`/2fa?uid=${user.uid}&email=${email}`);
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
      <div className="absolute inset-0 bg-[url('/images/the_starry_night.jpg')] brightness-50"></div>
      <div className="flex items-center justify-start h-full relative">
        <div className="absolute top-1/2 right-64 transform -translate-y-1/2">
          <img
            src="/images/Logo GeoProfs letter.png"
            alt="Right-Side Image"
            className="h-30 w-100"
          />
        </div>
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
          <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
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
