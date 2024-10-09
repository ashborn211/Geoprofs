"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext"; // Update the path accordingly
import "./verlof.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../FireBaseConfig";
import { Button } from "@nextui-org/react";

interface VerlofComponentProps {
  selectedDate: Date;
  onClose: () => void;
}

const VerlofComponent = ({ selectedDate, onClose }: VerlofComponentProps) => {
  const { user } = useUser(); // Access the user context
  const [reason, setReason] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("10:30"); // State for start time
  const [endTime, setEndTime] = useState<string>("16:30"); // State for end time

  const formattedDate = selectedDate.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = selectedDate.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleButtonClick = (buttonType: string) => {
    setSelectedButton(buttonType);
  };

  const handleSubmit = async () => {
    if (selectedButton && reason && user) { // Ensure user is defined
      try {
        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate: formattedDate,
          startTime,
          endTime,
          uid: user.uid,   // Use uid from user context
          name: user.userName, // Use name from user context
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
            {formattedDate} {formattedTime}
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
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
