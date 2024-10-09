"use client";

import { useState } from "react";
import "./verlof.css";
import { addDoc, collection, Timestamp } from "firebase/firestore"; // Import Timestamp
import { db } from "../../FireBaseConfig";
import { Button } from "@nextui-org/react";

interface VerlofComponentProps {
  selectedDate: Date; // Assuming this is a Date object
  onClose: () => void;
  userId: string;   // New prop for user ID
  name: string;     // New prop for user name
}

const VerlofComponent = ({ selectedDate, onClose, userId, name }: VerlofComponentProps) => {
  const [reason, setReason] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date(selectedDate.setHours(10, 30))); // Set start time as Date
  const [endTime, setEndTime] = useState<Date>(new Date(selectedDate.setHours(16, 30)));   // Set end time as Date

  // Keep the formatted date string for Firestore
  const formattedDate = selectedDate.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleButtonClick = (buttonType: string) => {
    setSelectedButton(buttonType);
  };

  const handleSubmit = async () => {
    if (selectedButton && reason) {
      try {
        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate: selectedDate,                  // Save as Date object
          startTime: Timestamp.fromDate(startTime), // Firestore timestamp
          endTime: Timestamp.fromDate(endTime),     // Firestore timestamp
          userId,                                    // Include the userId in the Firestore document
          name,                                      // Include the user's name in the Firestore document
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
            {formattedDate}
          </span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="content">
          <div className="section-wrapper">
            <div className="verlof-section">
              <button
                className={`verlof-button ${
                  selectedButton === "verlof" ? "selected" : ""
                }`}
                onClick={() => handleButtonClick("verlof")}
              >
                Verlof
              </button>
              <button
                className={`vakantie-button ${
                  selectedButton === "vakantie" ? "selected" : ""
                }`}
                onClick={() => handleButtonClick("vakantie")}
              >
                Vakantie
              </button>
            </div>

            <div className="time-section">
              <div className="time-input">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={startTime.toISOString().substr(11, 5)} // Convert to HH:mm format for input
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const updatedStartTime = new Date(startTime);
                    updatedStartTime.setHours(hours, minutes);
                    setStartTime(updatedStartTime);
                  }} // Update start time
                />
                <label>End Time:</label>
                <input
                  type="time"
                  value={endTime.toISOString().substr(11, 5)} // Convert to HH:mm format for input
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number);
                    const updatedEndTime = new Date(endTime);
                    updatedEndTime.setHours(hours, minutes);
                    setEndTime(updatedEndTime);
                  }} // Update end time
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
