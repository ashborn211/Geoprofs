"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input, Button } from "@nextui-org/react";
import { useUser } from "../context/UserContext";
import "./page.css";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Attempting to log in with:", email, password); // Debugging line

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      const user = userCredential.user;
      console.log("Login successful:", user);

      // Set user in context
      setUser({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || "Anonymous",
      });

      alert("Login successful!");
      router.push("/home");
    } catch (error: any) {
      console.error("Login Error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          alert("User does not exist. Contact support?");
          break;
        case "auth/wrong-password":
          alert("Incorrect password or email. Please try again.");
          break;
        case "auth/invalid-credential":
          alert(
            "Invalid email or password format. Please check your credentials."
          );
          break;
        default:
          alert("Login failed. Please try again.");
          break;
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
