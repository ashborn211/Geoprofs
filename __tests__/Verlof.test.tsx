// __tests__/verlofComponent.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerlofComponent from "@/components/verlof"; // Update to actual path
import { useUser } from "@/context/UserContext"; // Mock UserContext
import { db } from "@/FireBase/FireBaseConfig";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/FireBase/FireBaseConfig", () => ({
  db: { collection: jest.fn(), doc: jest.fn(), addDoc: jest.fn(), getDoc: jest.fn() },
}));

describe("VerlofComponent Integration Test", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        uid: "test-user-uid",
        userName: "Test User",
      },
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        vakantie: "Vakantie",
        verlof: "Verlof",
        ziek: "Ziek",
      }),
    });

    (addDoc as jest.Mock).mockResolvedValue({ id: "mock-doc-id" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should submit a leave request successfully", async () => {
    render(
      <VerlofComponent selectedDate={new Date()} onClose={mockOnClose} />
    );

    // Wait for leave types to load
    await waitFor(() => screen.getByLabelText(/select leave type/i));

    // Select leave type
    const leaveTypeSelect = screen.getByLabelText(/select leave type/i);
    fireEvent.change(leaveTypeSelect, { target: { value: "Vakantie" } });

    // Fill reason textarea
    const reasonTextarea = screen.getByPlaceholderText(/reden.../i);
    fireEvent.change(reasonTextarea, { target: { value: "Vakantie nodig." } });

    // Set start date and end date
    const startDateInput = screen.getByLabelText(/start date and time/i);
    const endDateInput = screen.getByLabelText(/end date and time/i);

    fireEvent.change(startDateInput, { target: { value: "2025-01-10T09:00" } });
    fireEvent.change(endDateInput, { target: { value: "2025-01-12T17:00" } });

    // Click submit button
    const submitButton = screen.getByRole("button", { name: /verstuur/i });
    fireEvent.click(submitButton);

    // Assert that addDoc was called with the correct data
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(collection(db, "verlof"), {
        type: "Vakantie",
        reason: "Vakantie nodig.",
        startDate: Timestamp.fromDate(new Date("2025-01-10T09:00")),
        endDate: Timestamp.fromDate(new Date("2025-01-12T17:00")),
        uid: "test-user-uid",
        name: "Test User",
        status: 1,
      });
    });

    // Assert onClose is called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should show an error when required fields are missing", async () => {
    render(
      <VerlofComponent selectedDate={new Date()} onClose={mockOnClose} />
    );

    // Wait for leave types to load
    await waitFor(() => screen.getByLabelText(/select leave type/i));

    // Click submit button without filling fields
    const submitButton = screen.getByRole("button", { name: /verstuur/i });
    fireEvent.click(submitButton);

    // Assert alerts are shown
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Selecteer een verloftype.");
      expect(window.alert).toHaveBeenCalledWith("Geef een reden op.");
    });

    // Assert addDoc is not called
    expect(addDoc).not.toHaveBeenCalled();
  });
});