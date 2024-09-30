"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input, Button } from "@nextui-org/react";
import { useUser } from "../context/UserContext"; // Import the User context

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useUser(); // Get the setUser method from the context
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setUser({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || "Anonymous",
      });

      alert("Login successful!");
      router.push("/user"); // Redirect after login
    } catch (error: any) {
      console.error(error.message);
      if (error.code === "auth/user-not-found") {
        alert("User does not exist. Contact support?");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password or email. Please try again.");
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              isRequired
              fullWidth
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              placeholder="****"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
