import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable from "@/app/admiin/show-user/page"; // Adjust path if necessary
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";


// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(), // Mock getFirestore here
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe("UserTable Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading initially, then renders users from Firestore", async () => {
    // Mock Firestore response
    const mockUsers = [
      {
        id: "1",
        data: () => ({
          userName: "John Doe",
          email: "johndoe@example.com",
          team: { id: "team1" },
          role: "Admin",
        }),
      },
      {
        id: "2",
        data: () => ({
          userName: "Jane Smith",
          email: "janesmith@example.com",
          team: { id: "team2" },
          role: "User",
        }),
      },
    ];

    const mockTeamDocs = {
      team1: { exists: () => true, data: () => ({ TeamName: "Team Alpha" }) },
      team2: { exists: () => true, data: () => ({ TeamName: "Team Beta" }) },
    };

    getDocs.mockResolvedValue({ docs: mockUsers });
    getDoc.mockImplementation((teamRef) =>
      Promise.resolve(mockTeamDocs[teamRef.id])
    );

    render(<UserTable />);

    // Verify loading message is shown initially
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();

    // Wait for users to load and be displayed
    await waitFor(() => expect(screen.queryByText(/Loading users.../i)).not.toBeInTheDocument());
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("johndoe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("deletes a user when delete button is clicked and confirms", async () => {
    const mockUsers = [
      {
        id: "1",
        data: () => ({
          userName: "John Doe",
          email: "johndoe@example.com",
          team: { id: "team1" },
          role: "Admin",
        }),
      },
    ];

    getDocs.mockResolvedValue({ docs: mockUsers });
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ TeamName: "Team Alpha" }) });
    deleteDoc.mockResolvedValue();

    render(<UserTable />);

    await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());

    // Mock confirm dialog to always return true
    jest.spyOn(window, "confirm").mockReturnValue(true);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(deleteDoc).toHaveBeenCalledWith(doc(db, "users", "1")));
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
});
