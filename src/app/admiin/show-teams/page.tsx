"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import Logout from "@/components/Logout";

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  teamName: string;
  users: User[];
}

export default function TeamUserTable() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teams and users from Firestore
  useEffect(() => {
    const fetchTeamsAndUsers = async () => {
      try {
        const teamQuerySnapshot = await getDocs(collection(db, "Team"));
        const teamsList: Team[] = [];

        // Fetch users for each team
        await Promise.all(
          teamQuerySnapshot.docs.map(async (teamDoc) => {
            const teamData = teamDoc.data();
            const users = await fetchUsersForTeam(teamDoc.id);

            teamsList.push({
              id: teamDoc.id,
              teamName: teamData.TeamName,
              users,
            });
          })
        );

        setTeams(teamsList);
      } catch (error) {
        console.error("Error fetching teams and users: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsersForTeam = async (teamId: string) => {
      const userQuerySnapshot = await getDocs(collection(db, "users"));
      return userQuerySnapshot.docs
        .map((userDoc) => {
          const userData = userDoc.data();
          // Check if the user's team matches the current team
          if (userData.team && userData.team.id === teamId) {
            return {
              id: userDoc.id,
              userName: userData.userName,
              email: userData.email,
              role: userData.role,
            };
          }
          return null;
        })
        .filter((user) => user !== null); // Filter out null values
    };

    fetchTeamsAndUsers();
  }, []);

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
                <h1 className="text-blue-700">Teams and Users</h1>
              </div>
            </div>

            {/* Team User Table */}
            <div className="col-span-12 row-span-8 col-start-1 p-8">
              {loading ? (
                <p className="text-blue-600">Loading teams and users...</p>
              ) : (
                <div className="h-full overflow-y-auto">
                  {teams.map((team) => (
                    <div key={team.id} className="mb-8">
                      <h2 className="text-2xl font-bold text-blue-800">
                        {team.teamName}
                      </h2>
                      {team.users.length > 0 ? (
                        <table className="min-w-full bg-white border-collapse shadow-lg">
                          <thead className="bg-blue-200">
                            <tr>
                              <th className="border p-4 text-left">ID</th>
                              <th className="border p-4 text-left">Name</th>
                              <th className="border p-4 text-left">Email</th>
                              <th className="border p-4 text-left">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {team.users.map((user) => (
                              <tr key={user.id} className="hover:bg-blue-100">
                                <td className="border p-4">{user.id}</td>
                                <td className="border p-4">{user.userName}</td>
                                <td className="border p-4">{user.email}</td>
                                <td className="border p-4">{user.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-blue-600">
                          No users assigned to this team.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
