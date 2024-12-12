import React from "react";
import { render } from "@testing-library/react";
import ResultsTable from "@/components/ResultsTable"; // Assuming the component is in the same directory

// Test the convertTimestampToString function logic
describe("convertTimestampToString function", () => {
  let component: any;

  beforeEach(() => {
    // Render the component to be able to test its behavior
    component = render(<ResultsTable data={[]} />);
  });

  it("should return a readable date string for a valid Firestore timestamp", () => {
    const timestamp = { seconds: 1609459200, nanoseconds: 0 }; // 01/01/2021
    const result = component.convertTimestampToString(timestamp);
    expect(result).toBe("1/1/2021");
  });

  it("should handle invalid Firestore timestamps", () => {
    const invalidTimestamp = { seconds: undefined, nanoseconds: undefined };
    const result = component.convertTimestampToString(invalidTimestamp);
    expect(result).toBe("Invalid Date");
  });

  it("should return 'Invalid Date' for an invalid Date object", () => {
    const invalidTimestamp = { seconds: "invalid", nanoseconds: "invalid" };
    const result = component.convertTimestampToString(invalidTimestamp);
    expect(result).toBe("Invalid Date");
  });

  it("should return 'No results found' when data is empty", () => {
    const { getByText } = render(<ResultsTable data={[]} />);
    expect(getByText("No results found.")).toBeInTheDocument();
  });

  it("should render data correctly when provided", () => {
    const data = [{ timestamp: { seconds: 1609459200, nanoseconds: 0 }, id: 1 }];
    const { getByText } = render(<ResultsTable data={data} />);
    expect(getByText("1/1/2021")).toBeInTheDocument(); // Assuming the data contains a timestamp
  });
});
