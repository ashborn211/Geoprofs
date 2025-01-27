"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import NavBar from "@/components/navBar/navBar";

interface User {
  id: string;
  userName: string;
  email: string;
  team: string;
  role: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and their teams from Firestore
  useEffect(() => {
    const fetchUsersWithTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList: User[] = await Promise.all(
          querySnapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            let teamName = "No Team"; // Default if no team reference

            if (userData.team && userData.team.id) {
              try {
                // Fetch team document if team reference exists
                const teamDoc = await getDoc(userData.team);

                // Safely access teamDoc data using type casting
                const teamData = teamDoc.data() as DocumentData | undefined;

                if (teamDoc.exists() && teamData) {
                  teamName = teamData.TeamName || "Unknown Team";
                }
              } catch (error) {
                console.error(
                  `Error fetching team for user ${userDoc.id}:`,
                  error
                );
              }
            }

            return {
              id: userDoc.id,
              userName: userData.userName,
              email: userData.email,
              team: teamName,
              role: userData.role,
            };
          })
        );

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithTeams();
  }, []);

  // Delete user from Firestore with confirmation
  const handleDelete = async (userId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", userId)); // Delete user document
        setUsers(users.filter((user) => user.id !== userId)); // Remove user from local state
        console.log(`User with ID ${userId} deleted successfully`);
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
                <NavBar />
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
                <h1>User List</h1>
              </div>
            </div>

            {/* User Table */}
            <div className="col-span-12 row-span-8 col-start-1 p-8">
  {loading ? (
    <p>Loading users...</p>
  ) : (
    <div className="overflow-y-auto max-h-[60vh]">
      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border p-4">ID</th>
            <th className="border p-4">Name</th>
            <th className="border p-4">Email</th>
            <th className="border p-4">Team</th>
            <th className="border p-4">Role</th>
            <th className="border p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-blue-100">
              <td className="border p-4">{user.id}</td>
              <td className="border p-4">{user.userName}</td>
              <td className="border p-4">{user.email}</td>
              <td className="border p-4">{user.team}</td>
              <td className="border p-4">{user.role}</td>
              <td className="border p-4">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </>
  );
}
