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
import { auth, db } from "@/FireBase/FireBaseConfig"; // Adjust the path as needed

// Define User interface
interface User {
  uid: string;
  email: string;
  userName: string | null;
  role: string | null; // New property
  team: string | null; // New property
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Fetch user data from db when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserState({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            userName: userData.userName || null,
            role: userData.role || null,
            team: userData.team || null,
          });
        } else {
          // User does not exist in Firestore
          console.error("No user document found for the authenticated user.");
        }
      } else {
        // User is logged out
        setUserState(null);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const setUser = (user: User | null) => setUserState(user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};