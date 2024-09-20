"use client";
import { useState } from "react";
import VerlofComponent from "../../components/verlof"; // Import the VerlofComponent

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden relative">
        <div className="w-[6vw] bg-blue-500 h-full"></div>
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            <div className="col-span-12 row-span-4 col-start-1 bg-yellow-500 flex justify-between p-4">
              <div className="bg-red-500" style={{ width: "75%" }}></div>
              <div className="bg-red-500" style={{ width: "20%" }}></div>
            </div>
            <div className="col-span-12 row-span-8 col-start-1 row-start-5 bg-green-500 flex justify-center items-center">
              <div
                className="bg-white rounded-lg"
                style={{ width: "90%", height: "90%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Popup Trigger */}
        <div className="absolute bottom-4 right-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => setShowPopup(true)}
          >
            Open Verlof Popup
          </button>
        </div>

        {/* Centered Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <VerlofComponent
              onClose={() => setShowPopup(false)} // Close popup when clicking "Close"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
