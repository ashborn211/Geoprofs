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
  role: string | null;
  team: string | null;
}

// Extend UserContextType to include `isLoading` state
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean; // Add isLoading to the context type
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

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
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

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
          console.error("No user document found for the authenticated user.");
        }
      } else {
        setUserState(null);
      }
      setIsLoading(false); // Once the authentication check is done, stop loading
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const setUser = (user: User | null) => setUserState(user);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
