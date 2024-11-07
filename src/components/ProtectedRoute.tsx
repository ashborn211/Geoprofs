"use client";

import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser(); // Access the user context
  const router = useRouter();
  const currentPath = usePathname(); // Get the current route path using usePathname()

  useEffect(() => {
    // If no user is logged in and we're not on the login page, redirect to the login page
    if (!user && currentPath !== "/") {
      router.push("/"); // Redirect to the login page
    }
  }, [user, router, currentPath]);

  // If no user is logged in, nothing is rendered and the user is redirected to the login page
  if (!user && currentPath !== "/") {
    return null; // Don't render anything while redirecting to login
  }

  // If user is logged in or we're on the login page, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
