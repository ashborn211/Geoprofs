// src/components/ProtectedRoute.tsx
"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser(); // Access the user context
  const router = useRouter();

  useEffect(() => {
    // If no user is logged in, redirect to the login page
    if (!user) {
      router.push("/"); // Redirect to the login page
    }
  }, [user, router]);

  // While checking the user status, you can return a loading message or nothing at all
  if (!user) {
    return <div>Loading...</div>; // Or you can return nothing or a spinner
  }

  // If user is logged in, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
