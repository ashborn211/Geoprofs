// __tests__/emailVerificationUtils.test.ts

import { handleSendVerification, handleConfirmVerification } from "@/utils/emailVerificationUtils";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";

describe("emailVerificationUtils", () => {
    let mockSetMessage: jest.Mock;
    let mockSetError: jest.Mock;
    let mockSetIsLoading: jest.Mock;

    beforeAll(async () => {
        const auth = getAuth();
        // Connect to the emulator
        connectAuthEmulator(auth, "http://127.0.0.1:9099");

        // Create a test user
        await createUserWithEmailAndPassword(auth, "test@example.com", "password123");
    });

    beforeEach(() => {
        mockSetMessage = jest.fn();
        mockSetError = jest.fn();
        mockSetIsLoading = jest.fn();
    });

    describe("handleSendVerification", () => {
        it("should send a verification email successfully", async () => {
            const auth = getAuth();
            // Sign in the test user
            await signInWithEmailAndPassword(auth, "test@example.com", "password123");

            // Simulate the API call
            const mockResponse = { message: "Verification email sent successfully." };
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
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

            await handleSendVerification(mockSetMessage, mockSetError, mockSetIsLoading);

            expect(mockSetError).toHaveBeenCalledWith("User is not authenticated.");
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });
    });

    // Similar tests for handleConfirmVerification can go here
});
describe('handleConfirmVerification', () => {
    let setMessage: jest.Mock;
    let setError: jest.Mock;
    let setIsLoading: jest.Mock;
    let setVerificationCode: jest.Mock;

    beforeEach(() => {
        // Mock the functions that handle state updates
        setMessage = jest.fn();
        setError = jest.fn();
        setIsLoading = jest.fn();
        setVerificationCode = jest.fn();

        // Mock global fetch (you could also use `jest.spyOn` if needed)
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful email verification', async () => {
        // Setup mock response for a successful API call
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Email successfully verified!' }),
        });

        const verificationCode = 'validCode';

        // Call the function
        await handleConfirmVerification(
            verificationCode,
            setMessage,
            setError,
            setIsLoading,
            setVerificationCode
        );

        // Assert that state setters are called as expected
        expect(setIsLoading).toHaveBeenCalledWith(true);
        expect(setMessage).toHaveBeenCalledWith('Email successfully verified!');
        expect(setVerificationCode).toHaveBeenCalledWith(''); // Reset the verification code
        expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle failed email verification', async () => {
        // Setup mock response for a failed API call
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid verification code.' }),
        });

        const verificationCode = 'invalidCode';

        // Call the function
        await handleConfirmVerification(
            verificationCode,
            setMessage,
            setError,
            setIsLoading,
            setVerificationCode
        );

        // Assert that state setters are called as expected
        expect(setIsLoading).toHaveBeenCalledWith(true);
        expect(setError).toHaveBeenCalledWith('Invalid verification code.');
        expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle unexpected error during email verification', async () => {
        // Setup mock to simulate a network error
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const verificationCode = 'errorCode';

        // Call the function
        await handleConfirmVerification(
            verificationCode,
            setMessage,
            setError,
            setIsLoading,
            setVerificationCode
        );

        // Assert that state setters are called as expected
        expect(setIsLoading).toHaveBeenCalledWith(true);
        expect(setError).toHaveBeenCalledWith('An unexpected error occurred.');
        expect(setIsLoading).toHaveBeenCalledWith(false);
    });
});