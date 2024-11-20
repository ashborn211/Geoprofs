import { NextResponse } from "next/server";

// Example API route that verifies the reCAPTCHA token
export async function POST(request: Request) {
    const { token } = await request.json();

    const secretKey = process.env.GOOGLE_API_KEY; // Use the environment variable

    if (!secretKey) {
        return NextResponse.json(
            { success: false, error: "Secret key is missing" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: "POST",
                body: new URLSearchParams({
                    secret: secretKey,
                    response: token,
                }),
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false });
        }
    } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
        return NextResponse.json(
            { success: false, error: "Verification failed" },
            { status: 500 }
        );
    }
}
