"use client";
import { useState, useEffect } from "react";
import CalendarComponent from "@/components/calendar/calendar"; // Updated import path for consistency
import VerlofComponent from "../../components/verlof"; // Import your VerlofComponent
import { useUser } from "../../context/UserContext"; // Import your user context
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import Logout from "@/components/Logout";
import { db } from "../../FireBase/FireBaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
<<<<<<< HEAD
=======
  addDoc, // Import addDoc to add documents
  query,
  where,
>>>>>>> verlof-component-fixes
  doc,
} from "firebase/firestore"; // Remove unused imports

export default function Home() {
  const { user } = useUser(); // Get user information from context
  const router = useRouter(); // Ensure it's called correctly

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [existingDateRanges, setExistingDateRanges] = useState<
    {
      startDate: Date;
      endDate: Date;
      reason: string;
      name: string;
      uid: string;
      status: number;
      docId: string; // Document ID toegevoegd
    }[]
  >([]); // Store existing date ranges

  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    startDate: Date;
    endDate: Date;
    reason: string;
    name: string;
    status: number;
    docId: string; // Document ID toegevoegd
  } | null>(null); // To store selected date info

  // State to control sick leave submission popup
  const [sickLeaveSubmitted, setSickLeaveSubmitted] = useState(false);

  // Fetch existing date ranges from Firestore
  const fetchExistingDates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "verlof")); // Use the "verlof" collection
      const dateRanges: {
        startDate: Date;
        endDate: Date;
        reason: string;
        name: string;
        uid: string;
        status: number;
        docId: string;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const startDate = doc.data().startDate;
        const endDate = doc.data().endDate;
        const reason = doc.data().reason;
        const name = doc.data().name;
        const uid = doc.data().uid;
        const status = doc.data().status;

        if (startDate && endDate) {
          dateRanges.push({
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            reason: reason || "",
            name: name || "",
            uid: uid || "",
            status: status || 1,
            docId: doc.id, // Store document ID for deletion
          });
        } else {
          console.warn(
            "startDate or endDate field is undefined for document ID:",
            doc.id
          );
        }
      });

      setExistingDateRanges(dateRanges);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchExistingDates();
  }, []);

  const handleDateSelect = (date: Date) => {
    const existingDateInfo = existingDateRanges.find(
      ({ startDate, endDate, uid }) => {
        return date >= startDate && date <= endDate && uid === user?.uid;
      }
    );

    if (existingDateInfo) {
      setSelectedDateInfo(existingDateInfo);
      return;
    }

    setSelectedDate(date);
    setShowPopup(true);
    setSelectedDateInfo(null);
  };

  const handleDelete = async () => {
    if (selectedDateInfo && selectedDateInfo.docId) {
      try {
        await deleteDoc(doc(db, "verlof", selectedDateInfo.docId)); // Remove document by docId
        fetchExistingDates(); // Refresh date ranges after deletion
        setSelectedDateInfo(null); // Clear selected date info after deletion
      } catch (error) {
        console.error("Error deleting leave request:", error);
      }
    }
  };

  const formatDateWithTime = (date: Date) => {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Navigate to the admin page
  const handleAdminClick = () => {
    router.push("/admiin"); // Adjust the path to your actual admin page
  };

  // Function to handle sick leave submission
  const handleSickLeave = async () => {
    if (user) {
      const today = new Date();
      const startDate = new Date(today); // Today's date
      const endDate = new Date(today); // End date is also today

      try {
        await addDoc(collection(db, "verlof"), {
          type: "ziek",
          reason: "ik ben ziek vandaag",
          startDate: startDate, // Firebase Timestamp will be handled automatically
          endDate: endDate, // Firebase Timestamp will be handled automatically
          uid: user.uid,
          name: user.userName,
          status: 2,
        });
        console.log("ziekte is gemeld!");
        setSickLeaveSubmitted(true); // Set the state to show popup
        fetchExistingDates(); // Refresh existing date ranges
      } catch (error) {
        console.error("Error voor ziekmelden:", error);
      }
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
                <div className="h-full w-1/2 text-[large] flex items-center justify-center flex-col">
                  {selectedDateInfo ? (
                    <>
                      <h2>
                        {selectedDateInfo.status === 1
                          ? "Pending"
                          : selectedDateInfo.status === 2
                          ? "Approved"
                          : selectedDateInfo.status === 3
                          ? "Denied"
                          : ""}
                      </h2>
                      <div
                        className="h-[120px] w-[210px] flex flex-col items-center justify-center rounded-[8%]"
                        style={{
                          backgroundColor:
                            selectedDateInfo.status === 1
                              ? "orange"
                              : selectedDateInfo.status === 2
                              ? "greenyellow"
                              : selectedDateInfo.status === 3
                              ? "red"
                              : "gray",
                        }}
                      >
                        <h1>{formatDateWithTime(selectedDateInfo.startDate)}</h1>
                        <h1>to</h1>
                        <h1>{formatDateWithTime(selectedDateInfo.endDate)}</h1>
                      </div>
                    </>
                  ) : (
                    <h1>Good morning, {user?.userName}</h1>
                  )}
                </div>

                {selectedDateInfo ? (
                  <div className="flex flex-col items-center">
                    <h1 className="text-[large]">Reason: {selectedDateInfo.reason}</h1>
                    <button
                      className="mt-4 h-[50px] w-[150px] bg-[white] border-[black] border-[solid] border-[2px] text-[x-large]"
                      onClick={handleDelete}
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>

              <div style={{ width: "20%" }}>
                <div
                  className="w-full h-[75%] bg-cover bg-center"
                  style={{
                    backgroundImage: "url('images/Logo GeoProfs.png')",
                  }}
                ></div>

                {/* Conditionally render the admin button */}
                {user?.role === "admin" && (
                  <button
                    className="bg-blue-500 text-white border-2 border-black rounded-lg w-full h-[20%] mb-2"
                    onClick={handleAdminClick}
                  >
                    <h1>Admin Action</h1>
                  </button>
                )}

<<<<<<< HEAD
                <button className="bg-white border-2 border-black rounded-lg w-full h-[25%]">
                  <h1>Report Sickness</h1>
=======
                <button
                  className="bg-white border-2 border-black rounded-lg w-full h-[25%]"
                  onClick={handleSickLeave} // Call sick leave function
                >
                  <h1>Ziek Melden</h1>
>>>>>>> verlof-component-fixes
                </button>
              </div>
            </div>
            <div className="col-span-12 row-span-8 col-start-1 row-start-5 bg-custom-gray-500 flex justify-center items-center">
              <div
                className="rounded-lg"
                style={{
                  width: "90%",
                  height: "90%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(52,198,254,1) 100%)",
                }}
              >
                <CalendarComponent onDateSelect={handleDateSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && selectedDate && (
        <VerlofComponent
          selectedDate={selectedDate}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Popup for sick leave submission */}
      {sickLeaveSubmitted && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">Ziekmelding succesvol ingediend!</h2>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setSickLeaveSubmitted(false); // Close the popup
                window.location.reload(); // Reload the page
              }}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}
