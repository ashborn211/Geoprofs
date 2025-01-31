"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Update the path accordingly
import "./verlof.css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
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
  const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Timestamp>(
    Timestamp.fromDate(selectedDate)
  );
  const [endDate, setEndDate] = useState<Timestamp>(
    Timestamp.fromDate(selectedDate)
  );

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const docRef = doc(db, "Type", "CWePoyL2VOnYR41hVCuE");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLeaveTypes([data.vakantie, data.verlof, data.ziek]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching leave types: ", error);
      }
    };
    fetchLeaveTypes();
  }, []);

  const formatDateForInput = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const timeZone = "Europe/Amsterdam";
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
  };

  const calculateLeaveDays = (start: Timestamp, end: Timestamp) => {
    const startDate = start.toDate();
    const endDate = end.toDate();
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async () => {
    if (selectedButton && reason && user) {
      try {
        const leaveDays = calculateLeaveDays(startDate, endDate);

        if (selectedButton === "vakantie") {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const currentVacationDays = userSnap.data().vakantiedagen;

            if (currentVacationDays >= leaveDays) {
              await updateDoc(userRef, {
                vakantiedagen: currentVacationDays - leaveDays,
              });
            } else {
              alert("Je hebt niet genoeg vakantiedagen!");
              return;
            }
          }
        }

        await addDoc(collection(db, "verlof"), {
          type: selectedButton,
          reason,
          startDate,
          endDate,
          uid: user.uid,
          name: user.userName,
          status: 1,
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

  return (
    <div className="verlof-popup-overlay">
      <div className="verlof-popup">
        <div className="popup-header">
          <span className="date-range">{formatDateForInput(startDate)}</span>
          <button className="close-button" onClick={onClose}>&times;</button>
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
                  onChange={(e) =>
                    setStartDate(Timestamp.fromDate(new Date(e.target.value)))
                  }
                />
                <label htmlFor="enddate-input">End Date and Time:</label>
                <input
                  id="enddate-input"
                  type="datetime-local"
                  value={formatDateForInput(endDate)}
                  onChange={(e) =>
                    setEndDate(Timestamp.fromDate(new Date(e.target.value)))
                  }
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

          <Button className="submit-button" color="primary" onClick={handleSubmit}>
            Verstuur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerlofComponent;
