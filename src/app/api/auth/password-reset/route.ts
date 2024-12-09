import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required." },
                { status: 400 }
            );
        }

        // Get the Firebase API key from environment variables
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Firebase API Key is not configured." },
                { status: 500 }
            );
        }

        // Call Firebase API to send a password reset email
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestType: "PASSWORD_RESET",
                    email,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to send password reset email.", details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({
            message: `Password reset email sent successfully to ${email}.`,
        });
    } catch (error) {
        console.error("Error in password reset API:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
