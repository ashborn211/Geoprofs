"use client";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/FireBase/FireBaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { generatePassword } from "@/utils/passwordGenerator"; // Adjust the path as necessary
import Logout from "@/components/Logout";

interface Team {
  id: string;
  TeamName: string;
}

export default function AddUser() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // New state for 2FA
  const [secretKey, setSecretKey] = useState(""); // New state for secretKey

  // Fetch teams from Firestore
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Team"));
        const teams = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          TeamName: doc.data().TeamName, // Ensure TeamName is retrieved
        }));

        setTeamList(teams);
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    };

    fetchTeams();
  }, []);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(10); // You can change the length if needed
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword).then(() => {
      alert("Password copied to clipboard!");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if email is already taken
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (!emailQuerySnapshot.empty) {
        alert("Email already taken. Please use a different email.");
        return;
      }

      // Create the user with Firebase Authentication
      const authUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Created user with email: ", email);
      console.log("User details: ", authUser.user);

      // Create the user document in Firestore with team reference
      await setDoc(doc(db, "users", authUser.user.uid), {
        userName: naam,
        email: email,
        team: doc(db, "Team", team),
        role: role,
        password: password, // Password can be sent for server-side hashing if needed
        emailVerified: false,
        is2FAEnabled: is2FAEnabled, // Add the 2FA enabled flag
        secretKey: secretKey, // Save the secret key
      });

      console.log("User document created in Firestore:", {
        userName: naam,
        email,
        team,
        role,
        is2FAEnabled,
        secretKey,
      });

      // Send a password reset email after user creation
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Password reset email sent successfully!");
        alert("Password reset email sent successfully!");
      } else {
        console.error("Failed to send password reset email:", data.message);
        alert(data.message || "Failed to send password reset email.");
      }

      // Reset form fields
      setNaam("");
      setEmail("");
      setTeam("");
      setRole("");
      setPassword("");
      setGeneratedPassword("");
      setIs2FAEnabled(false); // Reset the 2FA state
      setSecretKey(""); // Reset the secret key
    } catch (error) {
      console.error("Error adding user: ", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center h-full">
          <Logout />
        </div>
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            <div className="col-span-12 row-span-4 col-start-1 bg-custom-gray-500 flex justify-around p-4">
              <div
                className="rounded-lg text-4xl flex items-center justify-center p-[15px]"
                style={{
                  width: "65%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,1) 16%, rgba(90,209,254,1) 100%)",
                }}
              >
                <h1>Goedemorgen Admin</h1>
              </div>
            </div>

            <div className="col-span-12 row-span-8 col-start-1 p-8">
              <form
                className="flex flex-col space-y-4 w-1/3 mx-auto"
                onSubmit={handleSubmit}
              >
                <label className="flex flex-col">
                  Naam:
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Enter naam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col">
                  Email:
                  <input
                    type="email"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col">
                  Team:
                  <select
                    className="p-2 border border-gray-300 rounded"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    required
                  >
                    <option value="">Select a team</option>
                    {teamList.map((teamItem) => (
                      <option key={teamItem.id} value={teamItem.id}>
                        {teamItem.TeamName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col">
                  Role:
                  <select
                    className="p-2 border border-gray-300 rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </label>

                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Generate Password
                  </button>

                  {generatedPassword && (
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{generatedPassword}</span>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="text-blue-500"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label>
                    Enable 2FA:
                    <input
                      type="checkbox"
                      checked={is2FAEnabled}
                      onChange={() => setIs2FAEnabled(!is2FAEnabled)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Add User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
