"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../FireBase/FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Input, Button } from "@nextui-org/react";
import { useUser } from "../context/UserContext";
import { db } from "@/FireBase/FireBaseConfig"; // Import your Firestore instance
import ReCAPTCHA from "react-google-recaptcha";
import "./page.css";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid)); // Adjust to your Firestore path
      if (userDoc.exists()) {
        return userDoc.data(); // Returns the user data as an object
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

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
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
      return;
    }

    try {
      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        alert("Your email is not verified. Please verify it.");
        return;
      }

      // Fetch additional user data from Firestore after successful login
      const userData = await fetchUserData(user.uid);

      if (userData) {
        // Set user in context with additional data
        setUser({
          uid: user.uid,
          email: user.email!,
          userName: userData.userName || "Anonymous", // Use userName from Firestore
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
    }
  };

  return (
    <main className="">
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
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleCaptchaChange}
            />
          </div>

          <div className="button-group">
            <Button type="submit" className="login-button" color="primary">
              Inloggen
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
