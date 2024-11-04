// app/finishSignUp/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/FireBase/FireBaseConfig'; // Adjust the path as necessary
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'; // Import the necessary functions

const FinishSignUp = () => {
    const router = useRouter();

    useEffect(() => {
        const handleSignIn = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) { // Use the function here
                const email = window.prompt('Please provide your email for confirmation');
                if (email) {
                    try {
                        await signInWithEmailLink(auth, email, window.location.href); // Use the function here
                        alert('Email verified! You can now sign in.');
                        // Redirect to another page as needed
                        router.push('/'); // Redirect to the homepage or another page
                    } catch (error) {
                        console.error('Error signing in with email link', error);
                        alert('Failed to verify email. Please try again.');
                    }
                }
            }
        };

        handleSignIn();
    }, [router]);

    return <div>Finishing up...</div>;
};

export default FinishSignUp;
