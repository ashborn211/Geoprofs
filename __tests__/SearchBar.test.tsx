// __tests__/SearchBar.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar"; // Adjust the import path

// Sample data for testing
const sampleData = [
  { name: "Project Alpha", type: "Development", startDate: "2024-01-01" },
  { name: "Project Beta", type: "Research", startDate: "2024-02-01" },
  { name: "Project Gamma", type: "Development", startDate: "2024-03-01" },
];

describe("SearchBar Component", () => {
  it("displays all data when input is empty", () => {
    const mockOnSearch = jest.fn();
    
    render(<SearchBar allData={sampleData} onSearch={mockOnSearch} />);
    
    // Initially, it should call onSearch with all data
    expect(mockOnSearch).toHaveBeenCalledWith(sampleData);
  });

  it("filters results based on query", () => {
    const mockOnSearch = jest.fn();

    render(<SearchBar allData={sampleData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText("Search by name, type, or date...");
    
    // Simulate typing in the search bar
    fireEvent.change(input, { target: { value: "alpha" } });

    // Check that onSearch is called with the filtered results
    expect(mockOnSearch).toHaveBeenCalledWith([
      { name: "Project Alpha", type: "Development", startDate: "2024-01-01" },
    ]);
  });

  it("returns all data when the input is cleared", () => {
    const mockOnSearch = jest.fn();

    render(<SearchBar allData={sampleData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText("Search by name, type, or date...");
    
    // First, simulate typing a query
    fireEvent.change(input, { target: { value: "beta" } });
    expect(mockOnSearch).toHaveBeenCalledWith([
      { name: "Project Beta", type: "Research", startDate: "2024-02-01" },
    ]);

    // Now clear the input
    fireEvent.change(input, { target: { value: "" } });

    // Check that onSearch is called with all data again
    expect(mockOnSearch).toHaveBeenCalledWith(sampleData);
  });
});
