import { getAuth, sendPasswordResetEmail, connectAuthEmulator } from "firebase/auth";
import { POST } from "@/app/api/auth/password-reset/route"; // Import the API route handler
import { NextResponse } from "next/server";

describe("Password Reset API", () => {
  const validEmail = "test@example.com";
  const invalidEmail = "invalid@example.com";

  beforeAll(async () => {
    const auth = getAuth();
    // Connect to the Firebase emulator
    connectAuthEmulator(auth, "http://127.0.0.1:9099");

    // You can create a test user here if needed
    await sendPasswordResetEmail(auth, validEmail); // This is for testing the reset flow
  });

  afterAll(() => {
    // Cleanup, if any, after tests complete
    jest.restoreAllMocks();
  });

  it("should return 200 and a success message for a valid email", async () => {
    // Mock the global fetch to simulate Firebase API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Simulate the request object for the API
    const request = new Request("http://localhost/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validEmail }),
    });

    const response = await POST(request); // Call the handler directly
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      message: `Password reset email sent successfully to ${validEmail}.`,
    });

    jest.restoreAllMocks(); // Cleanup mocks
  });

  it("should return 400 if email is not provided", async () => {
    const request = new Request("http://localhost/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // No email
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: "Email is required.",
    });
  });

  it("should return 500 if Firebase API key is not configured", async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY; // Remove the API key

    const request = new Request("http://localhost/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validEmail }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: "Firebase API Key is not configured.",
    });

    // Restore the API key
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "fakeApiKey";
  });

  it("should handle Firebase API errors gracefully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { message: "EMAIL_NOT_FOUND" },
      }),
    });

    const request = new Request("http://localhost/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invalidEmail }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: "Failed to send password reset email.",
      details: { error: { message: "EMAIL_NOT_FOUND" } },
    });

    jest.restoreAllMocks(); // Cleanup mocks
  });
});
