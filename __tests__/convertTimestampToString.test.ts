import { convertTimestampToString } from "@/utils/convertTimestampToString";

describe("convertTimestampToString", () => {
  it("should return a valid date string for a valid Firestore timestamp", () => {
    const validTimestamp = { seconds: 1609459200, nanoseconds: 0 }; // Jan 1, 2021
    const result = convertTimestampToString(validTimestamp);
    expect(result).toBe("1/1/2021"); // Adjust based on your locale
  });

  it("should return 'Invalid Date' for an invalid timestamp", () => {
    const invalidTimestamp = { seconds: undefined, nanoseconds: undefined };
    const result = convertTimestampToString(invalidTimestamp);
    expect(result).toBe("Invalid Date");
  });

  it("should return 'Invalid Date' if timestamp is not provided", () => {
    const result = convertTimestampToString(null);
    expect(result).toBe("Invalid Date");
  });

  it("should call console.error for invalid timestamp", () => {
    const invalidTimestamp = { seconds: undefined, nanoseconds: undefined };
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    convertTimestampToString(invalidTimestamp);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid Firestore Timestamp:", invalidTimestamp);
    consoleErrorSpy.mockRestore();
  });
});
