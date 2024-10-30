// __tests__/AdminSearchPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminSearchPage from "@/app/admiin/admiin-search/page"; // Adjust import path if necessary
import { getDocs, collection } from "firebase/firestore";
import '@testing-library/jest-dom';

// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
}));

const mockData = [
  {
    id: "1",
    name: "Project Alpha",
    startDate: new Date("2024-01-01"), // Firestore timestamp
    type: "Development",
    reason: "New feature development",
    startTime: "09:00",
    endTime: "17:00",
    userId: "user_1",
  },
  {
    id: "2",
    name: "Project Beta",
    startDate: new Date("2024-02-01"), // Firestore timestamp
    type: "Research",
    reason: "Researching new technologies",
    startTime: "10:00",
    endTime: "16:00",
    userId: "user_2",
  },
  {
    id: "3",
    name: "Project Gamma",
    startDate: new Date("2024-03-01"), // Firestore timestamp
    type: "Development",
    reason: "Improving existing features",
    startTime: "11:00",
    endTime: "15:00",
    userId: "user_3",
  },
];

describe("AdminSearchPage Integration Test", () => {
  beforeEach(() => {
    // Mock implementation of getDocs to return mockData
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (callback: (doc: any) => void) => {
        mockData.forEach((data) => callback({ id: data.id, data: () => data }));
      },
    });

    // Mock the collection function to return a reference to "verlof"
    (collection as jest.Mock).mockReturnValue("verlof");
  });

  it("should display all data initially and filter results based on search input", async () => {
    render(<AdminSearchPage />);

    // Wait for the data to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText("Welcome, Admin")).toBeInTheDocument();
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
      expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    });

    // Check that all results are displayed initially
    expect(screen.getByText("New feature development")).toBeInTheDocument();
    expect(
      screen.getByText("Researching new technologies")
    ).toBeInTheDocument();
    expect(screen.getByText("Improving existing features")).toBeInTheDocument();

    // Simulate user input in the search bar
    const searchInput = screen.getByPlaceholderText(
      "Search by name, type, or date..."
    );
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    // Check if the results are filtered correctly
    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Project Beta")).not.toBeInTheDocument();
      expect(screen.queryByText("Project Gamma")).not.toBeInTheDocument();
    });

    // Clear the search input
    fireEvent.change(searchInput, { target: { value: "" } });

    // Verify that all data is displayed again
    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
      expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    });
  });
});
