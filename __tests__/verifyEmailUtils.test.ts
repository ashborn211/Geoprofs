import { handleSendVerification, handleConfirmVerification } from "@/utils/emailVerificationUtils";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";
import { expect } from '@jest/globals'; // Optional, if the issue persists

describe("emailVerificationUtils", () => {
    let mockSetMessage: jest.Mock;
    let mockSetError: jest.Mock;
    let mockSetIsLoading: jest.Mock;

    beforeAll(async () => {
        const auth = getAuth();
        connectAuthEmulator(auth, "http://localhost:9099");
        await createUserWithEmailAndPassword(auth, "test@example.com", "password123");
    });

    beforeEach(() => {
        mockSetMessage = jest.fn();
        mockSetError = jest.fn();
        mockSetIsLoading = jest.fn();
    });

    it("should send a verification email successfully", async () => {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, "test@example.com", "password123");

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ message: "Verification email sent successfully." }),
        });

        await handleSendVerification(mockSetMessage, mockSetError, mockSetIsLoading);

        expect(mockSetIsLoading).toHaveBeenCalledWith(true);
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/send-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: await auth.currentUser!.getIdToken() }),
        });
        expect(mockSetMessage).toHaveBeenCalledWith("Verification email sent successfully.");
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
    it("should handle error when no user is authenticated", async () => {
        const auth = getAuth();
        // Sign out the current user
        await auth.signOut();

        // Call the function under test
        await handleSendVerification(mockSetMessage, mockSetError, mockSetIsLoading);

        // Assert the behavior
        expect(mockSetError).toHaveBeenCalledWith("User is not authenticated.");
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
    describe("handleConfirmVerification", () => {
        let mockSetVerificationCode: jest.Mock;

        beforeEach(() => {
            // Initialize additional mock functions for `handleConfirmVerification`
            mockSetVerificationCode = jest.fn();

            // Mock global fetch
            global.fetch = jest.fn();
        });

        it("should handle successful email verification", async () => {
            // Mock a successful fetch response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Email successfully verified!" }),
            });

            const verificationCode = "validCode";

            // Call the function under test
            await handleConfirmVerification(
                verificationCode,
                mockSetMessage,
                mockSetError,
                mockSetIsLoading,
                mockSetVerificationCode
            );

            // Assert the behavior
            expect(mockSetIsLoading).toHaveBeenCalledWith(true);
            expect(mockSetMessage).toHaveBeenCalledWith("Email successfully verified!");
            expect(mockSetVerificationCode).toHaveBeenCalledWith(""); // Reset the verification code
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });

        it("should handle failed email verification", async () => {
            // Mock a failed fetch response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: "Invalid verification code." }),
            });

            const verificationCode = "invalidCode";

            // Call the function under test
            await handleConfirmVerification(
                verificationCode,
                mockSetMessage,
                mockSetError,
                mockSetIsLoading,
                mockSetVerificationCode
            );

            // Assert the behavior
            expect(mockSetIsLoading).toHaveBeenCalledWith(true);
            expect(mockSetError).toHaveBeenCalledWith("Invalid verification code.");
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });

        it("should handle unexpected error during email verification", async () => {
            // Mock a network error
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

            const verificationCode = "errorCode";

            // Call the function under test
            await handleConfirmVerification(
                verificationCode,
                mockSetMessage,
                mockSetError,
                mockSetIsLoading,
                mockSetVerificationCode
            );

            // Assert the behavior
            expect(mockSetIsLoading).toHaveBeenCalledWith(true);
            expect(mockSetError).toHaveBeenCalledWith("An unexpected error occurred.");
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });
    });
});
