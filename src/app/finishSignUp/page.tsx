// app/finishSignUp/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/FireBase/FireBaseConfig"; // Adjust the path as necessary
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"; // Import the necessary functions
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions

const FinishSignUp = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Use the function here
        const email = window.prompt(
          "Please provide your email for confirmation"
        );
        if (email) {
          try {
            const userCredential = await signInWithEmailLink(
              auth,
              email,
              window.location.href
            ); // Use the function here
            const user = userCredential.user; // Get the signed-in user

            // Update the user's email verification status in Firestore
            await updateDoc(doc(db, "users", user.uid), {
              emailVerified: true,
            });

            alert("Email verified! You can now sign in.");
            // Redirect to another page as needed
            router.push("/"); // Redirect to the homepage or another page
          } catch (error) {
            console.error("Error signing in with email link", error);
            alert("Failed to verify email. Please try again.");
          }
        }
      }
    };

    handleSignIn();
  }, [router]);

  return <div>Finishing up...</div>;
};

export default FinishSignUp;
