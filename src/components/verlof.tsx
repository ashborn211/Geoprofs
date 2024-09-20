"use client";

import { useState, useEffect } from "react";
import "./verlof.css";

interface VerlofComponentProps {
  onClose: () => void;
  selectedDate: Date; // Pass the selected date as a prop
}

const VerlofComponent = ({ onClose, selectedDate }: VerlofComponentProps) => {
  const [reason, setReason] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");

  // Helper function to format the date to DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set the date range when the selected date changes
  useEffect(() => {
    if (selectedDate) {
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 3); // Set the end date to 3 days later

      const formattedStartDate = formatDate(selectedDate);
      const formattedEndDate = formatDate(endDate);

      setDateRange(`${formattedStartDate} - ${formattedEndDate}`);
    }
  }, [selectedDate]);

  return (
    <div className="verlof-popup">
      <div className="popup-header">
        <span className="date-range">{dateRange}</span>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="content">
        <div className="verlof-section">
          <label className="verlof-label">Verlof</label>
          <button className="verlof-button">Vakantie</button>
        </div>

        <div className="time-section">
          <div className="time-input">
            <label>{dateRange.split(" - ")[0]}</label>
            <input type="time" defaultValue="10:30" />
          </div>
          <span className="time-separator">tot</span>
          <div className="time-input">
            <label>{dateRange.split(" - ")[1]}</label>
            <input type="time" defaultValue="14:30" />
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

        <button className="submit-button">verstuur</button>
      </div>
    </div>
  );
};

export default VerlofComponent;
