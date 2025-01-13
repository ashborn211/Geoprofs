import {
    getAuth,
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    deleteUser,
  } from "firebase/auth";
  
  describe("Password Reset API Integration Tests", () => {
    const firebaseAuthUrl = "http://127.0.0.1:9099"; // Firebase Auth Emulator URL
    const apiEndpoint = "http://localhost:3000/api/auth/password-reset"; // Your API endpoint
    const testEmail = "testuser@example.com";
    const testPassword = "password123";
  
    beforeAll(async () => {
      const auth = getAuth();
      connectAuthEmulator(auth, firebaseAuthUrl);
  
      // Clean up the test user if it already exists
      try {
        const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        await deleteUser(userCredential.user);
      } catch (error) {
        // Ignore errors for non-existing users
        if (error.code !== "auth/user-not-found") {
          throw error;
        }
      }
  
      // Create the test user
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    });
  
    it("should log in the user successfully", async () => {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      const user = userCredential.user;
  
      expect(user.email).toBe(testEmail);
      expect(user.emailVerified).toBe(false); // Assuming email is not verified
    });
  
    it("should successfully send a password reset email", async () => {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: testEmail }),
      });
  
      const responseData = await response.json();
  
      expect(response.ok).toBe(true);
      expect(responseData.message).toBe(
        `Password reset email sent successfully to ${testEmail}.`
      );
    });
  
    it("should fail when email is missing", async () => {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      const responseData = await response.json();
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Email is required.");
    });
  
    it("should fail when an invalid email is provided", async () => {
      const invalidEmail = "invalidemail@example.com"; // This user does not exist
  
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: invalidEmail }),
      });
  
      const responseData = await response.json();
  
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(responseData.error).toContain("Failed to send password reset email.");
    });
  });
  