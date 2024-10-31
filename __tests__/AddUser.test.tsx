import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page"; // Adjust path as necessary
import { auth, db } from "@/FireBase/FireBaseConfig"; // Import the Firebase configuration
import {
  setDoc,
  doc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import "@testing-library/jest-dom";

describe("AddUser Component", () => {
  beforeEach(async () => {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    // Check if the users collection exists and create a dummy document if it doesn't
    if (querySnapshot.empty) {
      await setDoc(doc(usersCollection, "dummyUser"), {
        userName: "Dummy User",
        email: "dummy@example.com",
      });
    }

    // Clear existing users in the 'users' collection before each test
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }, 15000);

  test("should add a new user to the database", async () => {
    render(<AddUser />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/team/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

    // Simulate form submission
    fireEvent.click(screen.getByText(/add user/i));

    // Verify user addition
    await waitFor(async () => {
      const userSnapshot = await getDocs(collection(db, "users"));
      const users = userSnapshot.docs.map((doc) => doc.data());

      expect(users).toContainEqual(
        expect.objectContaining({
          userName: "Test User",
          email: "test@example.com",
          role: "user",
        })
      );
    }, { timeout: 15000 });

    // Cleanup by removing the test user
    const userQuerySnapshot = await getDocs(collection(db, "users"));
    const deletePromises = userQuerySnapshot.docs.map((doc) => {
      if (doc.data().email === "test@example.com") {
        return deleteDoc(doc.ref);
      }
    });
    await Promise.all(deletePromises);
  }, 15000);
});
