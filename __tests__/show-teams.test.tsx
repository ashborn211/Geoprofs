import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TeamUserTable from "@/app/admiin/show-teams/page"; // Adjust the import path as needed
import "@testing-library/jest-dom";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/FireBase/FireBaseConfig"; // Ensure the path is correct

// Initialize Firebase
initializeApp(firebaseConfig);

// Set up Firestore
const db = getFirestore();

describe("TeamUserTable Integration Test", () => {
  beforeAll(async () => {
    // Add test data to Firestore
    await setDoc(doc(collection(db, "Team"), "team1"), {
      TeamName: "Team Alpha",
    });
    await setDoc(doc(collection(db, "users"), "user1"), {
      userName: "Alice",
      email: "alice@example.com",
      role: "Developer",
      team: { id: "team1" },
    });
    await setDoc(doc(collection(db, "users"), "user2"), {
      userName: "Bob",
      email: "bob@example.com",
      role: "Designer",
      team: { id: "team1" },
    });
  });

  afterAll(async () => {
    // Cleanup Firestore after tests
    await deleteDoc(doc(db, "Team", "team1"));
    await deleteDoc(doc(db, "users", "user1"));
    await deleteDoc(doc(db, "users", "user2"));
  });

  it("fetches and displays team and user data", async () => {
    render(<TeamUserTable />);

    // Wait for the loading state to finish
    await waitFor(() =>
      expect(
        screen.getByText(/Loading teams and users.../)
      ).not.toBeInTheDocument()
    );

    // Check if the team and user data is displayed
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
  });
});
