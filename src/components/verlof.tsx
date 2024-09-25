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
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

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
                <input type="time" defaultValue="10:30" />
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

          <Button className="submit-button" color="primary">
            verstuur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerlofComponent;
