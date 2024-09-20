"use client";

import { useState } from "react";
import "./verlof.css";
import { Button } from "@nextui-org/react";

interface VerlofComponentProps {
  selectedDate: Date;
  onClose: () => void;
}

const VerlofComponent = ({ selectedDate, onClose }: VerlofComponentProps) => {
  const [reason, setReason] = useState<string>("");

  // Format the date (you can adjust this to your preferred format)
  const formattedDate = selectedDate.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="verlof-popup">
      <div className="popup-header">
        {/* Show selected date */}
        <span className="date-range">{formattedDate}</span>
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
            <label>{formattedDate}</label>
            <input type="time" defaultValue="10:30" />
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

        <Button className="submit-button" color="primary">
          verstuur
        </Button>
      </div>
    </div>
  );
};

export default VerlofComponent;
