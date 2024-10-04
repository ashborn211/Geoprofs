"use client";
import { useState } from "react";
import VerlofComponent from "@/components/verlof";
import CalendarComponent from "@/components/calendar";
import "@/components/SearchBar.css"; 
import { useUser } from "@/context/UserContext"; 
import { Link } from "@nextui-org/react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { user } = useUser(); 
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowPopup(true); 
  };

  if (!user) {
    return <p>Loading user data...</p>; 
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
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
                    "linear-gradient(90deg, rgba(255,255,255,1) 16%, rgba(52,198,254,1) 100%)",
                }}
              >
                <h1>Goedemorgen {user.displayName || user.email}</h1>
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

        {showPopup && selectedDate && (
          <VerlofComponent
            selectedDate={selectedDate}
            onClose={() => setShowPopup(false)}
            userId={user.uid} 
            name={user.displayName || user.email} 
          />
        )}
      </div>
    </>
  );
}
