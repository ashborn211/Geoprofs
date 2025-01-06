"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/FireBase/FireBaseConfig";

// Define User interface
interface User {
  uid: string;
  email: string;
  userName: string | null;
  role: string | null;
  team: string | null;
}

// Extend UserContextType to include `isLoading` state
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the app is running in a test environment
    const isTestEnvironment =
      process.env.NODE_ENV === "test" || (typeof window !== "undefined" && window.Cypress);

    if (isTestEnvironment) {
      // Load mock user from localStorage in test mode
      const mockUser = localStorage.getItem("mockUser");
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      setIsLoading(false);
      return;
    }

    // Regular Firebase authentication flow
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setUser({
            uid: authUser.uid,
            email: authUser.email || "",
            userName: userSnap.data().userName,
            role: userSnap.data().role,
            team: userSnap.data().team,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
