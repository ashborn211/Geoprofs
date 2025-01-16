"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import Logout from "@/components/Logout";

interface Verlof {
  id: string;
  name: string;
  reason: string;
  startDate: string; // Timestamp as a string for display
  endDate: string; // Timestamp as a string for display
  status: number;
  type: string;
}

export default function VerlofTable() {
  const [verlof, setVerlof] = useState<Verlof[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch "verlof" collection from Firestore
  useEffect(() => {
    const fetchVerlof = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const verlofList: Verlof[] = querySnapshot.docs
          .map((verlofDoc) => {
            const verlofData = verlofDoc.data();
            
            return {
              id: verlofDoc.id,
              name: verlofData.name,
              reason: verlofData.reason,
              startDate: new Date(verlofData.startDate.seconds * 1000).toLocaleString(), // Convert timestamp to string
              endDate: new Date(verlofData.endDate.seconds * 1000).toLocaleString(), // Convert timestamp to string
              status: verlofData.status,
              type: verlofData.type,
            };
          })
          .filter((verlof) => verlof.status === 1); // Filter only status: 1

        setVerlof(verlofList);
      } catch (error) {
        console.error("Error fetching verlof data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerlof();
  }, []);

  // Handle status update (Approve or Reject)
  const handleStatusChange = async (verlofId: string, newStatus: number) => {
    try {
      const verlofRef = doc(db, "verlof", verlofId);
      await updateDoc(verlofRef, {
        status: newStatus,
      });

      // Filter the list to only include items with status 1
      const updatedVerlofList = verlof.filter(item => item.status === 1);

      // Immediately update local state with new status
      setVerlof((prevVerlof) =>
        prevVerlof.map((item) =>
          item.id === verlofId ? { ...item, status: newStatus } : item
        ).filter(item => item.status === 1) // Only include status 1 in the list
      );

      console.log(`Verlof entry with ID ${verlofId} updated to status ${newStatus}`);
    } catch (error) {
      console.error("Error updating status: ", error);
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
                <h1>Verlof List</h1>
              </div>
            </div>

            {/* Verlof Table */}
            <div className="col-span-12 row-span-8 col-start-1 p-8">
              {loading ? (
                <p>Loading verlof entries...</p>
              ) : (
                <table className="min-w-full bg-white border-collapse">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="border p-4">Name</th>
                      <th className="border p-4">Reason</th>
                      <th className="border p-4">Start Date</th>
                      <th className="border p-4">End Date</th>
                      <th className="border p-4">Status</th>
                      <th className="border p-4">Type</th>
                      <th className="border p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verlof.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-100">
                        <td className="border p-4">{item.name}</td>
                        <td className="border p-4" style={{ width: "300px" }}>{item.reason}</td> {/* Reason column width increased */}
                        <td className="border p-4">{item.startDate}</td>
                        <td className="border p-4">{item.endDate}</td>
                        <td className="border p-4">{item.status}</td>
                        <td className="border p-4">{item.type}</td>
                        <td className="border p-4 flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(item.id, 3)} // Afkeuren (status 3)
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Afkeuren
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 2)} // Goedkeuren (status 2)
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Goedkeuren
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
