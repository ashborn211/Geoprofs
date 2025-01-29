"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import NavBar from "@/components/navBar/navBar";

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
    const [selectedStatus, setSelectedStatus] = useState(1); // Default status is 1 (In behandeling)

    // Fetch "verlof" collection from Firestore
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
                .filter((verlof) => verlof.status === selectedStatus); // Filter based on selected status

            setVerlof(verlofList);
        } catch (error) {
            console.error("Error fetching verlof data: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerlof(); // Initial fetch on page load
    }, [selectedStatus]); // Refetch the list when the status changes

    // Convert status number to readable text
    const getStatusText = (status: number) => {
        switch (status) {
            case 1:
                return "In behandeling";
            case 2:
                return "Goedgekeurd";
            case 3:
                return "Afgekeurd";
            default:
                return "Onbekend";
        }
    };

    // Handle status update (Approve or Reject) with confirmation and feedback
    const handleStatusChange = async (verlofId: string, newStatus: number) => {
        const action = newStatus === 2 ? "approve" : "decline";
        const confirmMessage = `Are you sure you want to ${action} this leave request?`;

        if (window.confirm(confirmMessage)) {
            try {
                const verlofRef = doc(db, "verlof", verlofId);
                await updateDoc(verlofRef, {
                    status: newStatus,
                });

                // Refetch the list to reflect the updated status
                fetchVerlof(); // Refresh the list after updating the status

                const successMessage =
                    newStatus === 2
                        ? "Leave request has been approved successfully."
                        : "Leave request has been declined successfully.";

                alert(successMessage); // Show confirmation to the admin
                console.log(`Verlof entry with ID ${verlofId} updated to status ${newStatus}`);
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        } else {
            console.log(`Action canceled for verlof ID ${verlofId}`);
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
                                <h1>Verlof List</h1>
                            </div>
                        </div>

                        {/* Dropdown for selecting status */}
                        <div className="col-span-12 row-span-2 col-start-1 p-4 flex justify-center">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                className="border p-2 rounded"
                            >
                                <option value={1}>In behandeling</option>
                                <option value={2}>Goedgekeurd</option>
                                <option value={3}>Afgekeurd</option>
                            </select>
                        </div>

                        {/* Verlof Table with Scroll */}
                        <div className="col-span-12 row-span-8 col-start-1 p-8">
                            {loading ? (
                                <p>Loading verlof entries...</p>
                            ) : (
                                <div className="overflow-y-auto max-h-[43vh]"> {/* Scrollable container */}
                                    <table className="min-w-full bg-white border-collapse">
                                        <thead className="bg-blue-500 text-white">
                                            <tr>
                                                <th className="border p-4">Name</th>
                                                <th className="border p-4">Reason</th>
                                                <th className="border p-4">Start Date</th>
                                                <th className="border p-4">End Date</th>
                                                <th className="border p-4">Status</th>
                                                <th className="border p-4">Type</th>
                                                {/* Render Actions column only if status is 'In behandeling' */}
                                                {selectedStatus === 1 && (
                                                    <th className="border p-4">Actions</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {verlof.map((item) => (
                                                <tr key={item.id} className="hover:bg-blue-100">
                                                    <td className="border p-4">{item.name}</td>
                                                    <td className="border p-4" style={{ width: "300px" }}>{item.reason}</td> {/* Reason column width increased */}
                                                    <td className="border p-4">{item.startDate}</td>
                                                    <td className="border p-4">{item.endDate}</td>
                                                    <td className="border p-4">{getStatusText(item.status)}</td> {/* Status text */}
                                                    <td className="border p-4">{item.type}</td>
                                                    {/* Render Actions buttons only if status is 'In behandeling' */}
                                                    {selectedStatus === 1 && (
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
                                                    )}
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
