"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Update the path accordingly
import "./verlof.css";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
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
  const [startDate, setStartDate] = useState<Timestamp>(
    Timestamp.fromDate(selectedDate)
  ); // Initialize as Firebase Timestamp
  const [endDate, setEndDate] = useState<Timestamp>(
    Timestamp.fromDate(selectedDate)
  ); // Initialize as Firebase Timestamp

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

  // Helper to format date in the "YYYY-MM-DDTHH:MM" format and adjust to the Netherlands timezone
  const formatDateForInput = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    // Format date for Europe/Amsterdam (Netherlands time zone)
    return new Intl.DateTimeFormat("nl-NL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Amsterdam",
      hour12: false,
    })
      .formatToParts(date)
      .map((part) => part.value)
      .join("")
      .replace(", ", "T")
      .slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };

  const handleSubmit = async () => {
    if (selectedButton && reason && user) {
      try {
        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate, // Submit start date as Firebase Timestamp
          endDate, // Submit end date as Firebase Timestamp
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

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: Timestamp) => void
  ) => {
    const newDate = new Date(event.target.value);
    setter(Timestamp.fromDate(newDate));
  };

  return (
    <div className="verlof-popup-overlay">
      <div className="verlof-popup">
        <div className="popup-header">
          <span className="date-range">
            {formatDateForInput(startDate)} {/* Display formatted start date */}
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
                <label>Start Date and Time:</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(startDate)}
                  onChange={(e) => handleDateChange(e, setStartDate)}
                />
                <label>End Date and Time:</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(endDate)}
                  onChange={(e) => handleDateChange(e, setEndDate)}
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
