import { render } from '@testing-library/react';

// Mock implementation of the convertTimestampToString function
const convertTimestampToString = (timestamp: any) => {
  if (!timestamp) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid Date";
  }

  if (timestamp.seconds === undefined || timestamp.nanoseconds === undefined) {
    console.error("Invalid Firestore Timestamp:", timestamp);
    return "Invalid Date";
  }

  const date = new Date(timestamp.seconds * 1000);
  if (isNaN(date.getTime())) {
    console.error("Invalid Date object:", date);
    return "Invalid Date";
  }

  return date.toLocaleDateString();
};


describe("convertTimestampToString", () => {
  test("should return a readable date string for valid Firestore timestamps", () => {
    const validTimestamp = { seconds: 1691164800, nanoseconds: 0 }; // Aug 4, 2023
    expect(convertTimestampToString(validTimestamp)).toBe("8/4/2023"); // Adjust the date format if necessary
  });

  test("should return 'Invalid Date' for null or undefined timestamps", () => {
    expect(convertTimestampToString(null)).toBe("Invalid Date");
    expect(convertTimestampToString(undefined)).toBe("Invalid Date");
  });

  test("should return 'Invalid Date' for timestamps missing seconds or nanoseconds", () => {
    const invalidTimestamp1 = { nanoseconds: 0 }; // Missing seconds
    const invalidTimestamp2 = { seconds: 1691164800 }; // Missing nanoseconds
    expect(convertTimestampToString(invalidTimestamp1)).toBe("Invalid Date");
    expect(convertTimestampToString(invalidTimestamp2)).toBe("Invalid Date");
  });

  test("should return 'Invalid Date' for non-Firestore timestamp objects", () => {
    const invalidObject = { foo: "bar" };
    expect(convertTimestampToString(invalidObject)).toBe("Invalid Date");
  });

  test("should log errors for invalid timestamps", () => {
    console.error = jest.fn(); // Mock console.error
    const invalidTimestamp = { foo: "bar" };

    convertTimestampToString(invalidTimestamp);
    expect(console.error).toHaveBeenCalledWith(
      "Invalid Firestore Timestamp:",
      invalidTimestamp
    );
  });
});
