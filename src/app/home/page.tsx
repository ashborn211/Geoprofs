"use client";
import { useState, useEffect } from "react";
import CalendarComponent from "../../components/calendar/calendar";
import VerlofComponent from "../../components/verlof"; // Import your VerlofComponent
import { Link } from "@nextui-org/react";
import { useUser } from "../../context/UserContext"; // Import your user context
import { db } from "../../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const { user } = useUser(); // Get user information from context

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [existingDateRanges, setExistingDateRanges] = useState<
    {
      startDate: Date;
      endDate: Date;
      reason: string;
      name: string;
      uid: string;
    }[]
  >([]); // Store existing date ranges
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    startDate: Date;
    endDate: Date;
    reason: string;
    name: string;
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
      }[] = [];

      querySnapshot.forEach((doc) => {
        // Log the entire document data for debugging
        console.log("Document data:", doc.data());

        // Extract startDate, endDate, reason, name, and uid
        const startDate = doc.data().startDate;
        const endDate = doc.data().endDate;
        const reason = doc.data().reason; // Fetch reason for leave
        const name = doc.data().name; // Fetch name of the person requesting leave
        const uid = doc.data().uid; // Fetch user ID of the person requesting leave

        if (startDate && endDate) {
          dateRanges.push({
            startDate: startDate.toDate(), // Convert Timestamp to Date
            endDate: endDate.toDate(), // Convert Timestamp to Date
            reason: reason || "", // Use empty string if reason is undefined
            name: name || "", // Use empty string if name is undefined
            uid: uid || "", // Use empty string if uid is undefined
          });
        } else {
          console.warn(
            "startDate or endDate field is undefined for document ID:",
            doc.id
          ); // Log if any date is not defined
        }
      });

      setExistingDateRanges(dateRanges); // Update state with fetched date ranges
      console.log("Bestaande datums in de database:", dateRanges); // Log all existing date ranges
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchExistingDates(); // Fetch existing dates when the component mounts
  }, []);

  // Handle the date selected from the calendar
  const handleDateSelect = (date: Date) => {
    // Check if the selected date falls within any existing date range for the current user
    const existingDateInfo = existingDateRanges.find(
      ({ startDate, endDate, uid }) => {
        return date >= startDate && date <= endDate && uid === user?.uid; // Check if selected date is between startDate and endDate and uid matches
      }
    );

    if (existingDateInfo) {
      console.log("De datum valt binnen een bestaand verlofperiode."); // Log if the date is within an existing range
      setSelectedDateInfo(existingDateInfo); // Store selected date info
      return; // Do not open the popup if the date falls within an existing range
    }

    setSelectedDate(date); // Set selected date
    setShowPopup(true); // Open popup when a date is selected and not in the existing ranges
    setSelectedDateInfo(null); // Reset selected date info if a new date is selected
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center h-full">
          <Link href="./" className="text-white underline mb-[10px]">
            Log out
          </Link>
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
                      <h1>
                        {selectedDateInfo.startDate.toLocaleDateString()} tot{" "}
                        {selectedDateInfo.endDate.toLocaleDateString()}
                      </h1>
                      <div className="h-[120px] w-[120px] bg-orange-500"></div>{" "}
                    </>
                  ) : (
                    " "
                  )}
                </div>

                {selectedDateInfo ? (
                  <h1>
                    {selectedDateInfo.name} - Reden: {selectedDateInfo.reason}
                  </h1>
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
                <button className="bg-white border-2 border-black rounded-lg w-full h-[25%]">
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
