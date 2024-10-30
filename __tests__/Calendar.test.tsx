
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarComponent from "../src/components/calendar/calendar";
import "@testing-library/jest-dom";
import { act } from 'react';
import { getDocs } from "firebase/firestore";

window.scrollTo = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: "testUserId" }, 
  })),
  GoogleAuthProvider: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

// Mock de Firestore data
const mockDateRanges = [
  {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-03"),
    status: 1,
    docId: "testDoc1",
    uid: "testUserId",
  },
  {
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-02"),
    status: 2,
    docId: "testDoc2",
    uid: "testUserId",
  },
];

describe("CalendarComponent", () => {
  beforeEach(() => {
    // Mock de getDocs functie om gesimuleerde data te retourneren
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (callback: (doc: any) => void) =>
        mockDateRanges.forEach((range) => {
          callback({
            id: range.docId,
            data: () => ({
              startDate: { seconds: range.startDate.getTime() / 1000 },
              endDate: { seconds: range.endDate.getTime() / 1000 },
              status: range.status,
              uid: range.uid,
            }),
          });
        }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Haal ff alle mocks weer weg
  });

  it("renders the Calendar component with the correct label", () => {
    // Test dat de Calendar component correct wordt gerenderd met het juiste labelText
    render(<CalendarComponent onDateSelect={() => {}} />);
    expect(screen.getByLabelText("Hij is er!")).toBeInTheDocument(); // Controleer of het label in het document staat
  });

  it("fetches date ranges from Firestore and sets state correctly", async () => {
    // Test of de date ranges correct worden opgehaald uit Firestore
    await act(async () => {
      render(<CalendarComponent onDateSelect={() => {}} />);
    });
    expect(getDocs).toHaveBeenCalled(); // Controleer of getDocs is aangeroepen
  });
});
