import { getAuth, connectAuthEmulator, signInWithCustomToken, signOut } from "firebase/auth";
import fetchMock from "jest-fetch-mock";
import axios from "axios";
import { handleSendVerification, handleConfirmVerification } from "@/utils/emailVerificationUtils";
import * as admin from "firebase-admin";

const PROJECT_ID = "geoprofs-3f4e4";

const deletingFirebaseDataUrl = `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const deletingAuthDataUrl = `http://localhost:9099/emulator/v1/projects/${PROJECT_ID}/accounts`;


const functionTest = require("firebase-functions-test"); // Updated import

const test = functionTest({
    projectId: PROJECT_ID, // Your project ID
});

// Initialize Firebase Admin and Emulator
async function initApps() {
    admin.initializeApp({
        projectId: PROJECT_ID,
    });
    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099");
}

// Cleanup Firebase data and reinitialize
async function deleteAllDataAndApps() {
    admin.apps.forEach(app => app?.delete());
    await axios.delete(deletingFirebaseDataUrl);
    await axios.delete(deletingAuthDataUrl);
    test.cleanup();
}

beforeEach(initApps);
afterEach(deleteAllDataAndApps);

// Test: handleSendVerification for authenticated user
test("handleSendVerification - Valid User", async () => {
    const auth = getAuth();

    // Mock the authenticated user
    await signInWithCustomToken(auth, "mock-custom-token");
    const currentUser = auth.currentUser;
    expect(currentUser).not.toBeNull(); // Ensure user is authenticated

    const setMessage = jest.fn();
    const setError = jest.fn();
    const setIsLoading = jest.fn();

    // Mock fetch response for sending verification email
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Verification email sent successfully." }));

    // Call the function
    await handleSendVerification(setMessage, setError, setIsLoading);

    // Assertions
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: expect.any(String) }),
    });
    expect(setMessage).toHaveBeenCalledWith("Verification email sent successfully.");
    expect(setError).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenCalledWith(false);
});

// Test: handleSendVerification for unauthenticated user
test("handleSendVerification - Unauthenticated User", async () => {
    const auth = getAuth();

    // Mock unauthenticated user
    await signOut(auth); // Ensure the user is signed out

    const setMessage = jest.fn();
    const setError = jest.fn();
    const setIsLoading = jest.fn();

    // Call the function
    await handleSendVerification(setMessage, setError, setIsLoading);

    // Assertions
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setMessage).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith("User is not authenticated.");
    expect(setIsLoading).toHaveBeenCalledWith(false);
});

// Test: handleConfirmVerification with valid code
test("handleConfirmVerification - Valid Code", async () => {
    const setMessage = jest.fn();
    const setError = jest.fn();
    const setIsLoading = jest.fn();
    const setVerificationCode = jest.fn();

    // Mock fetch response for confirming verification code
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Email successfully verified!" }));

    // Call the function
    const verificationCode = "valid-code";
    await handleConfirmVerification(verificationCode, setMessage, setError, setIsLoading, setVerificationCode);

    // Assertions
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/confirm-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode: verificationCode }),
    });
    expect(setMessage).toHaveBeenCalledWith("Email successfully verified!");
    expect(setError).not.toHaveBeenCalled();
    expect(setVerificationCode).toHaveBeenCalledWith("");
    expect(setIsLoading).toHaveBeenCalledWith(false);
});

// Test: handleConfirmVerification with invalid code
test("handleConfirmVerification - Invalid Code", async () => {
    const setMessage = jest.fn();
    const setError = jest.fn();
    const setIsLoading = jest.fn();
    const setVerificationCode = jest.fn();

    // Mock fetch response for confirming verification code
    fetchMock.mockResponseOnce(
        JSON.stringify({ error: "Invalid verification code." }),
        { status: 400 }
    );

    // Call the function
    const verificationCode = "invalid-code";
    await handleConfirmVerification(verificationCode, setMessage, setError, setIsLoading, setVerificationCode);

    // Assertions
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/confirm-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode: verificationCode }),
    });
    expect(setMessage).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith("Invalid verification code.");
    expect(setVerificationCode).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenCalledWith(false);
});
