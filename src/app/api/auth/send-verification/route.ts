import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { error: "Missing idToken in request body." },
                { status: 400 }
            );
        }

        // Firebase API Key (replace this with a secure method, e.g., environment variable)
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Firebase API Key is not configured." },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestType: "VERIFY_EMAIL",
                    idToken,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: "Failed to send verification email.", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ message: "Verification email sent.", ...data });
    } catch (error) {
        console.error("Error in send-verification API:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
