"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider, db } from "../../FireBaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Input, Button, Link } from "@nextui-org/react"; // Using NextUI 2.0 components
import "./page.css";
import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const standardProfilePicture =
  "https://hongkongfp.com/wp-content/uploads/2023/06/20230610_164958-Copy.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      router.push("/user");
    } catch (error: any) {
      console.error(error.message);
      if (error.code === "auth/user-not-found") {
        const register = confirm(
          "User does not exist. Do you want to register?"
        );
        if (register) {
          router.push("/register");
        }
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User:", user);

      const userQuery = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty) {
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          profilePicture: user.photoURL || standardProfilePicture,
        });
      }

      router.push("/home");
    } catch (error: any) {
      console.error("Google Sign-In error:", error);

      alert(`Google Sign-In failed: ${error.message}`);
    }
  };

  return (
    <main className="main">
      <div className="container">
        <div className="logo-container">
          <img
            src="/images/LogoGeoProfs.png" // Corrected path for Next.js
            alt="GeoProfs Logo"
            className="logo"
          />
        </div>
        <h2 className="title">Inloggen</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              isRequired
              fullWidth
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isRequired
              fullWidth
            />
          </div>

          <div className="button-group">
            <Button
              onClick={handleGoogleSignIn}
              color="danger"
              className="google-button"
            >
              Google
            </Button>
            <Button type="submit" className="login-button" color="primary">
              Inloggen
            </Button>
          </div>

          <div className="signup-link">
            <Link href="register">Or Sign Up Instead</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
