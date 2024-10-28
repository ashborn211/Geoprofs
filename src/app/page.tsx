"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider, db } from "../../FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
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

  return (
    <main className="">
              <div className="logo-container">
          <img
            src="/images/LogoGeoProfs.png" // Corrected path for Next.js
            alt="GeoProfs Logo"
            className="logo"
          />
        </div>
        <div className="container">
        <h2 className="title">Inloggen</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <Input
              type="email"
              placeholder="E-mail..."
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
              placeholder="****"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isRequired
              fullWidth
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
