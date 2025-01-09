import { createServer } from "http";
import { POST as handler } from "@/app/api/auth/password-reset/route"; // Adjust to your API route file path
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from "firebase/auth";
import supertest from "supertest";

describe("Password Reset API Integration", () => {
  let server: ReturnType<typeof createServer>;
  let request: supertest.SuperTest<supertest.Test>;
  const testUserEmail = "test@example.com";

  beforeAll(async () => {
    // Connect to Firebase Auth Emulator
    const auth = getAuth();
    connectAuthEmulator(auth, "http://127.0.0.1:9099");

    // Create a test user
    await createUserWithEmailAndPassword(auth, testUserEmail, "password123");

    // Mock environment variable for Firebase API Key
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "fakeApiKey";

    // Create a server for the API route
    server = createServer((req, res) => handler(req, res));
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
  });

  it("should return 200 and a success message when email is valid", async () => {
    const res = await request.post("/api/auth/password-reset").send({ email: testUserEmail });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: `Password reset email sent successfully to ${testUserEmail}.`,
    });
  });

  it("should return 400 when email is not provided", async () => {
    const res = await request.post("/api/auth/password-reset").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Email is required.",
    });
  });

  it("should return 500 when Firebase API key is missing", async () => {
    // Temporarily remove the API key
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const res = await request.post("/api/auth/password-reset").send({ email: testUserEmail });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Firebase API Key is not configured.",
    });

    // Restore the API key
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "fakeApiKey";
  });

  it("should handle Firebase API errors gracefully", async () => {
    // Mock fetch to simulate a Firebase API error
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { message: "INVALID_EMAIL" },
      }),
    });

    const res = await request.post("/api/auth/password-reset").send({ email: "invalid@example.com" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Failed to send password reset email.",
      details: { error: { message: "INVALID_EMAIL" } },
    });

    jest.restoreAllMocks();
  });
});
