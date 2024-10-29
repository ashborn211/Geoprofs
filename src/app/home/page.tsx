"use client";
import { useState } from "react";
import CalendarComponent from "@/components/calendar/calendar";
import VerlofComponent from "../../components/verlof";
import { useUser } from "../../context/UserContext"; // Import your user context
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import Logout from "@/components/Logout";

export default function Home() {
  const { user } = useUser(); // Get user information from context
  const router = useRouter(); // Ensure it's called correctly

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handle the date selected from the calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowPopup(true); // Open popup when a date is selected
  };
  // Navigate to the admin page
  const handleAdminClick = () => {
    router.push("/admiin"); // Adjust the path to your actual admin page
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
                <h1>Goedemorgen {user?.userName}</h1>
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
