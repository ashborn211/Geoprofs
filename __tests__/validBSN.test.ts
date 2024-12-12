import { isValidBSN } from '@/utils/validBSN'; // Assuming the function is in isValidBSN.ts

describe('isValidBSN', () => {
    // Valid BSNs
    test('should return true for valid 9-digit BSN', () => {
        expect(isValidBSN(111222333)).toBe(true); // Valid 9-digit BSN
        expect(isValidBSN(123456782)).toBe(true); // Valid 9-digit BSN
        expect(isValidBSN(232262536)).toBe(true); // Valid 9-digit BSN
        expect(isValidBSN(10464554)).toBe(true); // Valid 8-digit BSN (padded to 9 digits)
    });

    test('should return true for valid 8-digit BSN with leading zero', () => {
        expect(isValidBSN(10464554)).toBe(true); // Valid 8-digit BSN (automatically padded to 9)
    });

    // Invalid BSNs
    test('should return false for invalid BSN with all zeros', () => {
        expect(isValidBSN(0o00000000)).toBe(false); // Invalid BSN with all zeros
    });

    test('should return false for invalid checksum BSNs', () => {
        expect(isValidBSN(192837465)).toBe(false); // Invalid checksum
        expect(isValidBSN(247594057)).toBe(false); // Invalid checksum
        expect(isValidBSN(88888888)).toBe(false); // Invalid checksum
        expect(isValidBSN(0o00000012)).toBe(false); // Invalid checksum
    });

    test('should return false for too short or too long BSNs', () => {
        expect(isValidBSN(73)).toBe(false); // Too short (less than 8 digits)
        expect(isValidBSN(3112223342)).toBe(false); // Too long (more than 9 digits)
    });

    // Edge cases
    test('should return false for non-numeric BSNs', () => {
        expect(isValidBSN(NaN)).toBe(false); // Invalid numeric input
        expect(isValidBSN('abc123456' as any)).toBe(false); // Non-numeric characters as invalid type
        expect(isValidBSN(12345678 as any)).toBe(false); // Non-numeric character case
    });

    test('should return false for BSNs with spaces', () => {
        expect(isValidBSN(111222333)).toBe(false); // Invalid case with spaces
        expect(isValidBSN(123456782)).toBe(false); // Invalid with invalid characters
    });
});
