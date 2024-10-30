// src/components/__tests__/verlof.test.tsx
import React from "react"; // Importeer React
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // Importeer testhulpmiddelen
import VerlofComponent from "@/components/verlof";
import { useUser } from "@/context/UserContext"; // Importeer de UserContext
import { db } from "@/FireBase/FireBaseConfig"; // Importeer Firebase configuratie
import { addDoc } from "firebase/firestore"; // Importeer addDoc voor het toevoegen van documenten

// Mock de UserContext
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(), // Mock de useUser hook
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  setPersistence: jest.fn().mockImplementation(() => Promise.resolve()), // Ensure this returns a promise
  browserLocalPersistence: {},
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(), // Mock addDoc functie
  Timestamp: {
    fromDate: jest.fn((date) => ({ toDate: () => date })), // Mock de fromDate functie
  },
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
}));

describe("VerlofComponent", () => {
  const mockClose = jest.fn(); // Mock de onClose functie

  beforeEach(() => {
    // Stel de context en test data in
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: "testUserId", userName: "Test User" }, // Mock een gebruiker
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Maak alle mocks schoon na elke test
  });

  it("submits the form with the correct data", async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({}); // Mock de succesvolle document toevoeging

    render(<VerlofComponent selectedDate={new Date()} onClose={mockClose} />); // Render de component

    // Vul het formulier in
    fireEvent.change(screen.getByLabelText(/Select Leave Type/i), {
      target: { value: "vakantie" }, // Selecteer een leave type
    });
    fireEvent.change(screen.getByPlaceholderText("reden..."), {
      target: { value: "Zomer vakantie" }, // Vul een reden in
    });

    // Vul de start- en einddatums in
    fireEvent.change(screen.getByLabelText(/Start Date and Time:/i), {
      target: { value: "2024-07-01T10:00" }, // Stel een startdatum in
    });
    fireEvent.change(screen.getByLabelText(/End Date and Time:/i), {
      target: { value: "2024-07-15T10:00" }, // Stel een einddatum in
    });

    // Klik op de submit knop
    fireEvent.click(screen.getByText(/Verstuur/i));

    // Controleer of de addDoc functie is aangeroepen met de juiste data
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          type: "vakantie",
          reason: "Zomer vakantie",
          startDate: expect.anything(), // Verander dit naar specifieke timestamp indien nodig
          endDate: expect.anything(), // Verander dit naar specifieke timestamp indien nodig
          uid: "testUserId",
          name: "Test User",
          status: 1,
        })
      );
      expect(mockClose).toHaveBeenCalled(); // Controleer of de onClose functie is aangeroepen
    });
  });
});
