"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Update the path accordingly
import "./verlof.css";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../FireBaseConfig";
import { Button } from "@nextui-org/react";

interface VerlofComponentProps {
  selectedDate: Date;
  onClose: () => void;
}

const VerlofComponent = ({ selectedDate, onClose }: VerlofComponentProps) => {
  const { user } = useUser(); // Access the user context
  const [reason, setReason] = useState<string>("");
  const [leaveTypes, setLeaveTypes] = useState<string[]>([]); // State for leave types
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    selectedDate.toISOString().split("T")[0]
  ); // Using date input for start date
  const [endDate, setEndDate] = useState<string>(
    selectedDate.toISOString().split("T")[0]
  ); // Using date input for end date
  const [startTime, setStartTime] = useState<string>(""); // State for start time
  const [endTime, setEndTime] = useState<string>(""); // State for end time

  // Fetch leave types from Firestore
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const docRef = doc(db, "Type", "CWePoyL2VOnYR41hVCuE"); // Replace with your actual document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Assuming the fields in the document are the strings you want
          setLeaveTypes([
            data.speciaalVerlof,
            data.vakantie,
            data.verlof,
            data.ziek,
          ]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching leave types: ", error);
      }
    };

    fetchLeaveTypes();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async () => {
    if (selectedButton && reason && user) {
      try {
        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate, // Submit start date
          endDate, // Submit end date
          startTime, // Submit start time
          endTime, // Submit end time
          uid: user.uid, // Use uid from user context
          name: user.userName, // Use name from user context
          status: 1, // Set status to a number value of 1
        });
        alert("Verlof/Vakantie request submitted!");
        onClose();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="verlof-popup-overlay">
      <div className="verlof-popup">
        <div className="popup-header">
          <span className="date-range">
            {startDate} {/* Display selected start date */}
          </span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="content">
          <div className="section-wrapper">
            <div className="verlof-section">
              <label>Select Leave Type:</label>
              <select
                value={selectedButton || ""}
                onChange={(e) => setSelectedButton(e.target.value)}
              >
                <option value="" disabled>
                  Select type
                </option>
                {leaveTypes.map((leaveType, index) => (
                  <option key={index} value={leaveType}>
                    {leaveType}
                  </option>
                ))}
              </select>
            </div>

            <div className="time-section">
              <div className="time-input">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Start Time:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <label>End Time:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="reason-section">
            <textarea
              className="reason-textarea"
              placeholder="reden..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <Button
            className="submit-button"
            color="primary"
            onClick={handleSubmit}
          >
            Verstuur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerlofComponent;
