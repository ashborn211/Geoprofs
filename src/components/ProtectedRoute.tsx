"use client";

import { useUser } from "@/context/UserContext"; // Access the user context
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser(); // Get user and loading state from context
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for the user state to be loaded and updated (due to persistence)
    if (isLoading) {
      setIsChecking(true);
      return;
    }

    // If no user is logged in, redirect to the login page
    if (!user) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [user, isLoading, router]);

  // If still checking the user state (loading from persistence), you can return nothing or a loading message
  if (isChecking) {
    return <div>Loading...</div>; // Or you can return a spinner or nothing at all
  }

  // If user is logged in, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
