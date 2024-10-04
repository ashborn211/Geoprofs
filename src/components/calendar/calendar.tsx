"use client";

import React, { useEffect } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import './calendar.css';

import { db } from "../../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function CalendarComponent() {
  let [value, setValue] = React.useState<DateValue | null>(null);

  useEffect(() => {
    const fetchAllStartDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        querySnapshot.forEach((doc) => {
          const startDate = new Date(doc.data().startDate.seconds * 1000);
          const documentId = doc.id; 
          console.log(`${documentId} heeft de startdatum: ${startDate.getDate()}`);
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchAllStartDates();
  }, []);


  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        style={{
          fontSize: "23px",
          boxShadow: "none",
          textSizeAdjust: "larger",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          height: "100%",
          width: "100%",
          // borderColor: "red"
        }}
      />
    </div>
  );
}
