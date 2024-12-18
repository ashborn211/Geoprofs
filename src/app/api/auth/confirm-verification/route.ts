import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { oobCode } = await request.json();

    if (!oobCode) {
      return NextResponse.json(
        { error: "Missing oobCode in request body." },
        { status: 400 }
      );
    }

    // Firebase API Key (securely retrieved from environment variables)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Firebase API Key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oobCode,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to confirm email verification.", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      message: "Email verification confirmed successfully.",
      ...data,
    });
  } catch (error) {
    console.error("Error in confirm-verification API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
