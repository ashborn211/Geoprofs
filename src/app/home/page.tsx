"use client";
import { useState, useEffect } from "react";
import CalendarComponent from "@/components/calendar/calendar"; // Updated import path for consistency
import VerlofComponent from "../../components/verlof"; // Import your VerlofComponent
import { useUser } from "../../context/UserContext"; // Import your user context
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import Logout from "@/components/Logout";
import NavBar from "@/components/navBar/navBar";
import { db } from "../../FireBase/FireBaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc, // Import addDoc to add documents
  query,
  where,
  doc,
  getDoc, // Import getDoc to get documents
  updateDoc, // Import updateDoc to update documents
} from "firebase/firestore"; // Remove unused imports

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
    type: string; // Added type field
  } | null>(null); // To store selected date info

  // State to control sick leave submission popup
  const [sickLeaveSubmitted, setSickLeaveSubmitted] = useState(false);

  // Function to calculate number of days off
  const calculateDaysOff = (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      console.error("Ongeldige datums:", startDate, endDate);
      return 0;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Fetch existing date ranges from Firestore
  const fetchExistingDates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "verlof"));
      const dateRanges: {
        startDate: Date;
        endDate: Date;
        reason: string;
        name: string;
        uid: string;
        status: number;
        docId: string;
        type: string;
      }[] = [];

      querySnapshot.forEach((doc) => {
        const startDate = doc.data().startDate;
        const endDate = doc.data().endDate;
        const reason = doc.data().reason;
        const name = doc.data().name;
        const uid = doc.data().uid;
        const status = doc.data().status;
        const type = doc.data().type; // Get the type field

        if (startDate && endDate) {
          dateRanges.push({
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            reason: reason || "",
            name: name || "",
            uid: uid || "",
            status: status || 1,
            docId: doc.id, // Store document ID for deletion
            type: type || "", // Ensure type is set
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
    if (selectedDateInfo && selectedDateInfo.docId && user) {
      const daysOff = calculateDaysOff(selectedDateInfo.startDate, selectedDateInfo.endDate);

      try {
        await deleteDoc(doc(db, "verlof", selectedDateInfo.docId));

        if (selectedDateInfo.type === "vakantie") {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const currentVacationDays = userDoc.data().vakantiedagen || 0;
            console.log("Current vacation days:", currentVacationDays);

            const updatedVacationDays = currentVacationDays + daysOff;
            console.log("Updated vacation days:", updatedVacationDays);

            await updateDoc(userRef, {
              vakantiedagen: updatedVacationDays,
            });

            fetchExistingDates();
            setSelectedDateInfo(null);
            window.location.reload();
          } else {
            console.error("User document does not exist");
          }
        } else {
          fetchExistingDates();
          setSelectedDateInfo(null);
        }
      } catch (error) {
        console.error("Error deleting leave request or updating vacation days:", error);
      }
    }
  };

  const formatDateWithTime = (date: Date) => {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleAdminClick = () => {
    router.push("/admiin"); 
  };

  const handleSickLeave = async () => {
    if (user) {
      const today = new Date();
      const startDate = new Date(today);
      const endDate = new Date(today);

      try {
        await addDoc(collection(db, "verlof"), {
          type: "ziek",
          reason: "ik ben ziek vandaag",
          startDate: startDate, 
          endDate: endDate, 
          uid: user.uid,
          name: user.userName,
          status: 2,
        });
        console.log("ziekte is gemeld!");
        setSickLeaveSubmitted(true);
        fetchExistingDates();
      } catch (error) {
        console.error("Error voor ziekmelden:", error);
      }
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-linear1">
        <div className="w-[6vw]  h-full flex flex-col justify-end items-center">
          <NavBar />
        </div>
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            <div className="col-span-12 row-span-4 col-start-1 bg-linear1 flex justify-around p-4">
              <div
                className="rounded-lg text-4xl flex items-center justify-center p-[15px] shadow-lg mt-2"
                style={{
                  width: "65%",
                  background:
                    "linear-gradient(180deg, rgba(183, 201, 211) 0%, rgba(218, 237, 255) 100%)",
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

                {user?.role === "admin" && (
                  <button
                    className="bg-blue-500 text-white border-2 border-black rounded-lg w-full h-[16%] mb-2"
                    onClick={handleAdminClick}
                  >
                    <h1>Admin Action</h1>
                  </button>
                )}

                <button
                  className="bg-white border-2 border-black rounded-lg w-full h-[20%]"
                  onClick={handleSickLeave}
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

      {sickLeaveSubmitted && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">Ziekmelding succesvol ingediend!</h2>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setSickLeaveSubmitted(false);
                window.location.reload();
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
