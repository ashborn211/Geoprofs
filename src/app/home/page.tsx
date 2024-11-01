"use client";
import { useState, useEffect } from "react";
import CalendarComponent from "@/components/calendar/calendar"; // Updated import path for consistency
import VerlofComponent from "../../components/verlof"; // Import your VerlofComponent
import { Link } from "@nextui-org/react";
import { useUser } from "../../context/UserContext"; // Import your user context
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import Logout from "@/components/Logout";
import { db } from "../../FireBase/FireBaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc, // Import addDoc to add documents
  query,
  where,
  doc,
} from "firebase/firestore"; // Verwijder functionaliteit toegevoegd

export default function Home() {
  const { user } = useUser(); // Get user information from context
  const router = useRouter(); // Ensure it's called correctly

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [existingDateRanges, setExistingDateRanges] = useState<{
    startDate: Date;
    endDate: Date;
    reason: string;
    name: string;
    uid: string;
    status: number;
    docId: string; // Document ID toegevoegd
  }[]>([]); // Store existing date ranges

  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    startDate: Date;
    endDate: Date;
    reason: string;
    name: string;
    status: number;
    docId: string; // Document ID toegevoegd
  } | null>(null); // To store selected date info

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
            docId: doc.id, // Sla het document ID op om later te kunnen verwijderen
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

  // Verlofaanvraag verwijderen
  const handleDelete = async () => {
    if (selectedDateInfo && selectedDateInfo.docId) {
      try {
        await deleteDoc(doc(db, "verlof", selectedDateInfo.docId)); // Verwijderen van document met docId
        window.location.reload();
        console.log("Verlofaanvraag succesvol verwijderd");

        // Pagina herladen om de verwijdering weer te geven
        fetchExistingDates();
        setSelectedDateInfo(null); // Clear de geselecteerde data info na verwijderen
      } catch (error) {
        console.error("Fout bij het verwijderen van de verlofaanvraag:", error);
      }
    }
  };

  const formatDateWithTime = (date: Date) => {
    return `${date.toLocaleDateString()} om ${date.toLocaleTimeString([], {
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
          status: 1,
        });
        console.log("Sick leave submitted successfully");
        fetchExistingDates(); // Refresh existing date ranges
      } catch (error) {
        console.error("Error submitting sick leave:", error);
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
                      {/* Status text based on status */}
                      <h2>
                        {selectedDateInfo.status === 1
                          ? "Nog niet verwerkt"
                          : selectedDateInfo.status === 2
                          ? "Goedgekeurd"
                          : selectedDateInfo.status === 3
                          ? "Afgekeurd"
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
                        <h1>
                          {formatDateWithTime(selectedDateInfo.startDate)}
                        </h1>
                        <h1>t/m</h1>
                        <h1>{formatDateWithTime(selectedDateInfo.endDate)}</h1>
                      </div>
                    </>
                  ) : (
                    " "
                  )}
                </div>

                {selectedDateInfo ? (
                  <div className="flex flex-col items-center">
                    <h1 className="text-[large]">
                      Reden: {selectedDateInfo.reason}
                    </h1>
                    {/* Toevoegen van een knop onder de reden */}
                    <button
                      className="mt-4 h-[50px] w-[150px] bg-[white] border-[black] border-[solid] border-[2px] text-[x-large]"
                      onClick={handleDelete} // Verwijder actie aan knop toegevoegd
                    >
                      Verwijderen
                    </button>
                  </div>
                ) : (
                  <h1>Goedemorgen {user?.userName}</h1>
                )}
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
                    onClick={handleAdminClick} // Call function on click
                  >
                    <h1>Admin Action</h1>
                  </button>
                )}

                <button
                  className="bg-white border-2 border-black rounded-lg w-full h-[25%]"
                  onClick={handleSickLeave} // Call sick leave function
                >
                  <h1>Ziek Melden</h1>
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
    </>
  );
}
