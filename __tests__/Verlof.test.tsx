import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerlofComponent from "@/components/verlof"; // Update the path accordingly
import { UserProvider } from "@/context/UserContext"; // Import the provider
import { db } from "@/FireBase/FireBaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import "@testing-library/jest-dom";

// Mock user data
const mockUser = {
  user: { uid: "testUser123", userName: "Test User" },
};

// Helper to render with UserProvider
const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <UserProvider value={mockUser}>
      {ui}
    </UserProvider>
  );
};

describe("VerlofComponent Integration Tests", () => {
  it("fetches and displays leave types from Firestore", async () => {
    renderWithProviders(<VerlofComponent selectedDate={new Date()} onClose={() => {}} />);

    // Wacht tot de opties worden geladen
    await waitFor(() => {
      expect(screen.getByText("Vakantie")).toBeInTheDocument();
      expect(screen.getByText("Verlof")).toBeInTheDocument();
      expect(screen.getByText("Ziek")).toBeInTheDocument();
    });
  });

  it("writes data to Firestore", async () => {
    renderWithProviders(<VerlofComponent selectedDate={new Date()} onClose={() => {}} />);

    // Vul het formulier in
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Vakantie" },
    });
    fireEvent.change(screen.getByPlaceholderText("reden..."), {
      target: { value: "Vakantie nodig" },
    });

    fireEvent.click(screen.getByText("Verstuur"));

    // Controleer of het document is toegevoegd in Firestore
    const q = query(
      collection(db, "verlof"),
      where("type", "==", "Vakantie"),
      where("reason", "==", "Vakantie nodig")
    );

    const snapshot = await getDocs(q);

    expect(snapshot.size).toBe(1);
    const doc = snapshot.docs[0].data();
    expect(doc).toEqual({
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
