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
import { generatePassword } from "@/utils/passwordGenerator";
import Logout from "@/components/Logout";
import bcrypt from "bcryptjs";
import { isValidBSN } from "@/utils/validBSN";

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
  const [bsnNumber, setBsnNumber] = useState("");  // Added BSN number state

  // Fetch teams from Firestore
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Team"));
        const teams = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          TeamName: doc.data().TeamName,
        }));
        setTeamList(teams);
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    };

    fetchTeams();
  }, []);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(10);
    setPassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidBSN(parseInt(bsnNumber))) {
      alert("Invalid BSN number. Please enter a valid BSN.");
      return;
    }     
    const bsnNumberQuery = query(
      collection(db, "users"),
      where("bsnNumber", "==", bsnNumber)
    );
    const bsnNumberQuerySnapshot = await getDocs(bsnNumberQuery);

    if (!bsnNumberQuerySnapshot.empty) {
      alert("BSN already taken. Please use a different BSN.");
      return;
    }
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

      const hashedPassword = await bcrypt.hash(password, 10);

      //put connection here

      // Create the user with Firebase Authentication
      const authUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Created user with email: ", email);
      console.log("User details: ", authUser.user);

      

      // Create the user document in Firestore with team reference and BSN number
      await setDoc(doc(db, "users", authUser.user.uid), {
        userName: naam,
        email: email,
        team: doc(db, "Team", team),
        role: role,
        password: hashedPassword,
        bsnNumber: bsnNumber,  // Saving the BSN number
        emailVerified: false,
      });

      console.log("User document created in Firestore:", {
        userName: naam,
        email,
        team,
        role,
        hashedPassword,
        password,
        bsnNumber,  // Logging BSN number
      });

      // Call the custom API route to send a password reset email
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error sending password reset email:", responseData);
        alert("Failed to send password reset email. Please try again.");
        return;
      }

      console.log("Password reset email sent to:", email);
      alert(responseData.message);

      // Reset form fields
      setNaam("");
      setEmail("");
      setTeam("");
      setRole("");
      setPassword("");
      setGeneratedPassword("");
      setBsnNumber("");  // Resetting BSN number field
    } catch (error) {
      console.error("Error adding user: ", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
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
                  BSN Number:
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Enter BSN number"
                    value={bsnNumber}
                    onChange={(e) => setBsnNumber(e.target.value)}  // Handle BSN input
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
