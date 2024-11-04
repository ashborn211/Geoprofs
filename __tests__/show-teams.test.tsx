// __tests__/show-teams.test.tsx
import { getFirestore, collection, doc, setDoc, deleteDoc } from "firebase/firestore"; // Import doc here

import { render, screen, waitFor } from "@testing-library/react";
import TeamUserTable from "@/app/admiin/show-teams/page";
import { initializeApp } from "firebase/app";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGPXI9a5y1kYgNmW-bd7kcEXtzPBrDC7M",
  authDomain: "geoprofs-3f4e4.firebaseapp.com",
  databaseURL:
    "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "geoprofs-3f4e4",
  storageBucket: "geoprofs-3f4e4.appspot.com",
  messagingSenderId: "956083793044",
  appId: "1:956083793044:web:f1674b50fae72ccf18d881",
  measurementId: "G-ZFMSVSN97W",
};

initializeApp(firebaseConfig);

describe("TeamUserTable Integration Test", () => {
  beforeAll(async () => {
    // Setup Firestore with test data
    const db = getFirestore();
    const teamRef = collection(db, "Team");
    const userRef = collection(db, "users");

    // Add test data to Firestore
    await setDoc(doc(teamRef, "team1"), { TeamName: "Team Alpha" });
    await setDoc(doc(userRef, "user1"), {
      userName: "Alice",
      email: "alice@example.com",
      role: "Member",
      team: { id: "team1" },
    });
    await setDoc(doc(userRef, "user2"), {
      userName: "Bob",
      email: "bob@example.com",
      role: "Member",
      team: { id: "team1" },
    });
  });

  afterAll(async () => {
    // Cleanup Firestore after tests
    const db = getFirestore();
    await deleteDoc(doc(collection(db, "Team"), "team1"));
    await deleteDoc(doc(collection(db, "users"), "user1"));
    await deleteDoc(doc(collection(db, "users"), "user2"));
  });

  it("fetches and displays team and user data", async () => {
    render(<TeamUserTable />);

    // Check if loading message is displayed
    expect(screen.getByText(/loading teams and users/i)).toBeInTheDocument();

    // Wait for the teams to be displayed
    await waitFor(() => {
      expect(screen.getByText(/team alpha/i)).toBeInTheDocument();
    });

    // Check for user names
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();

    // Check for user emails
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument();

    // Check for user roles
    expect(screen.getByText(/member/i)).toBeInTheDocument();
  });
});
