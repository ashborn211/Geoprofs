"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/FireBase/FireBaseConfig";
import Logout from "@/components/Logout";
import NavBar from "@/components/navBar/navBar";

export default function UserProfile() {
  const [userData, setUserData] = useState({
    bsnNumber: "",
    naam: "",
    email: "",
    team: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
    
          if (userDoc.exists()) {
            const userData = userDoc.data();
    
            let teamName = "";
            if (userData.team.id) {
              const teamDocRef = doc(db, "Team", userData.team.id);
              const teamDoc = await getDoc(teamDocRef);
    
              if (teamDoc.exists()) {
                const teamData = teamDoc.data();
                teamName = teamData.TeamName || ""; // Safely access the team name
              } else {
                console.error("No team document found");
              }
            } else {
              console.error("User does not have a valid team reference");
            }
    
            setUserData({
              bsnNumber: userData.bsnNumber || "",
              naam: userData.userName || "",
              email: userData.email || "",
              team: teamName, // Use resolved team name
            });
          } else {
            console.error("No user document found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchUserData();
  }, []);

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
                <h1>Welcome, {userData.naam || "User"}</h1>
              </div>
            </div>

            <div className="col-span-12 row-span-8 col-start-1 p-8">
              {loading ? (
                <div className="text-center text-xl">Loading...</div>
              ) : (
                <div className="p-6 bg-white shadow-md rounded-lg w-1/3 mx-auto">
                  <h2 className="text-2xl mb-4 text-center">Your Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <strong>BSN:</strong>
                      <span className="ml-2">{userData.bsnNumber}</span>
                    </div>
                    <div>
                      <strong>Name:</strong>
                      <span className="ml-2">{userData.naam}</span>
                    </div>
                    <div>
                      <strong>Email:</strong>
                      <span className="ml-2">{userData.email}</span>
                    </div>
                    <div>
                      <strong>Team:</strong>
                      <span className="ml-2">{userData.team}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
