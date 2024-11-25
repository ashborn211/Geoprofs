"use client";

import { useUser } from "@/context/UserContext"; // Access the user context
import { useRouter, usePathname } from "next/navigation"; // Get current pathname
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser(); // Get user and loading state from context
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setIsChecking(true);
      return;
    }

    if (!user && pathname !== "/") {
      router.push("/"); // Redirect only if not already on "/"
    } else {
      setIsChecking(false);
    }
  }, [user, isLoading, pathname, router]);

  // If still checking the user state (loading from persistence), display a loading message
  if (isChecking) {
    return <div>Loading...</div>; // Or use a spinner or skeleton UI
  }

  // If the user is logged in, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
