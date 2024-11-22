"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Update the path accordingly
import "./verlof.css";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import { Button } from "@nextui-org/react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"; // Import date-fns-tz for timezone handling

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

  // Helper to format date for "datetime-local" input
  const formatDateForInput = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const timeZone = "Europe/Amsterdam"; // Fixed timezone

    // Convert the date to the Netherlands timezone
    const zonedDate = toZonedTime(date, timeZone);

    // Format it as YYYY-MM-DDTHH:MM (required by datetime-local input)
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedButton && reason && user) {
      try {
        console.log("Submitting:", {
          type: selectedButton,
          reason,
          startDate: startDate.toDate(), // Debug log
          endDate: endDate.toDate(),     // Debug log
          uid: user.uid,
          name: user.userName,
          status: 1,
        });

        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate, // Submit start date as Firebase Timestamp
          endDate,   // Submit end date as Firebase Timestamp
          uid: user.uid, // Use uid from user context
          name: user.userName, // Use name from user context
          status: 1, // Set status to a number value of 1
        });

        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.warn("Missing required fields");
      if (!selectedButton) alert("Selecteer een verloftype.");
      if (!reason) alert("Geef een reden op.");
    }
  };

  // Handle changes to date inputs
  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: Timestamp) => void
  ) => {
    const newDate = new Date(event.target.value);
    console.log("Selected date:", newDate); // Debug log
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
                <label htmlFor="startdate-input">Start Date and Time:</label>
                <input
                  id="startdate-input"
                  type="datetime-local"
                  value={formatDateForInput(startDate)}
                  onChange={(e) => handleDateChange(e, setStartDate)}
                />
                <label htmlFor="enddate-input">End Date and Time:</label>
                <input
                  id="enddate-input"
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
