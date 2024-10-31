import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerlofComponent from "@/components/verlof"; // update the path accordingly
import { useUser } from "@/context/UserContext";
import { db } from "@/FireBase/FireBaseConfig";
import { getDoc, addDoc, Timestamp } from "firebase/firestore";
import "@testing-library/jest-dom";

beforeAll(() => {
  jest.spyOn(console, "info").mockImplementation(() => {}); // Onderdrukt Auth Emulator meldingen
});


// Mock user context
jest.mock("@/context/UserContext", () => ({
  useUser: () => ({
    user: { uid: "testUser123", userName: "Test User" },
  }),
}));

// Mock Firestore methods
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
}));

describe("VerlofComponent", () => {
  beforeEach(() => {
    // Mock data for leave types document
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        speciaalVerlof: "Speciaal Verlof",
        vakantie: "Vakantie",
        verlof: "Verlof",
        ziek: "Ziek",
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays leave types from Firestore", async () => {
    render(<VerlofComponent selectedDate={new Date()} onClose={() => {}} />);

    // Wait for the options to load
    await waitFor(() => {
      expect(screen.getByText("Speciaal Verlof")).toBeInTheDocument();
      expect(screen.getByText("Vakantie")).toBeInTheDocument();
      expect(screen.getByText("Verlof")).toBeInTheDocument();
      expect(screen.getByText("Ziek")).toBeInTheDocument();
    });
  });

  it("submits the form with valid input", async () => {
    render(<VerlofComponent selectedDate={new Date()} onClose={() => {}} />);

    // Wait for the leave types to load
    await waitFor(() => {
      expect(screen.getByText("Speciaal Verlof")).toBeInTheDocument();
    });

    // Select leave type
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Vakantie" },
    });

    // Input reason
    fireEvent.change(screen.getByPlaceholderText("reden..."), {
      target: { value: "Vakantie nodig" },
    });

    // Mock addDoc response
    (addDoc as jest.Mock).mockResolvedValue({ id: "newDocId" });

    // Submit form
    fireEvent.click(screen.getByText("Verstuur"));

    // Assert addDoc was called with correct data
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        type: "Vakantie",
        reason: "Vakantie nodig",
        startDate: expect.any(Timestamp),
        endDate: expect.any(Timestamp),
        uid: "testUser123",
        name: "Test User",
        status: 1,
      });
    });
  });
});
