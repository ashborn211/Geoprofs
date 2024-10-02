"use client";

import React, { useEffect } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import './calendar.css';

import { db } from "../../../FireBaseConfig"; // Import Firestore config
import { collection, getDocs } from "firebase/firestore"; // Functie om alle documenten op te halen

export default function CalendarComponent() {
  let [value, setValue] = React.useState<DateValue | null>(null);

  useEffect(() => {
    // Functie om alle documenten en hun startdatum op te halen
    const fetchAllStartDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof")); // Haal alle documenten uit de 'verlof' collectie
        querySnapshot.forEach((doc) => {
          const startDate = doc.data().startDate; // Haal de 'startDate' op
          const documentId = doc.id; // Haal het document ID op
          console.log(`${documentId} heeft de startdatum: ${startDate}`); // Log het document ID en startdatum
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchAllStartDates(); // Haal de documenten op zodra de component laadt
  }, []); // Lege dependency array zorgt ervoor dat het maar één keer gebeurt

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value} // Gebruikt de state om geselecteerde waarde te beheren
        onChange={(newValue) => setValue(newValue)} // Update de waarde wanneer een datum geselecteerd wordt
        style={{
          fontSize: "23px",
          boxShadow: "none",
          textSizeAdjust: "larger",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          height: "100%",
          width: "100%"
        }}
      />
    </div>
  );
}
