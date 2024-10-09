"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import "./calendar.css";
import { db } from "../../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function CalendarComponent() {
  const [value, setValue] = React.useState<DateValue | null>(null);
  const [startDates, setStartDates] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null); // Ref opnieuw toegevoegd

  useEffect(() => {
    const fetchAllStartDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const dates: number[] = [];
        querySnapshot.forEach((doc) => {
          const startDate = new Date(doc.data().startDate.seconds * 1000);
          const documentId = doc.id;
          console.log(`${documentId} heeft de startdatum: ${startDate.getDate()}`);
          dates.push(startDate.getDate());
        });
        setStartDates(dates);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchAllStartDates();
  }, []);

  useEffect(() => {
    const highlightMatchingSpans = () => {
      if (containerRef.current) {
        const spans = containerRef.current.querySelectorAll("span");

        // Loop door de startdatums en markeer de bijbehorende spans
        startDates.forEach((date) => {
          const matchingSpans = Array.from(spans).filter(
            (span) => span.textContent === `${date}`
          );

          // Maak de achtergrondkleur van overeenkomende spans rood zonder de innerHTML te overschrijven
          matchingSpans.forEach((span) => {
            span.style.backgroundColor = "red";
            span.style.color = "white";
          });

          console.log(`Aantal spans met waarde "${date}": ${matchingSpans.length}`);
        });
      }
    };

    highlightMatchingSpans();
  }, [startDates]);

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        ref={containerRef} // Ref toegevoegd om DOM manipulatie mogelijk te maken
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log("Selected date:", newValue); // Log de geselecteerde datum
          console.log("Date value object:", JSON.stringify(newValue)); // Inspecteer het newValue object
        }}
        style={{
          fontSize: "23px",
          boxShadow: "none",
          textSizeAdjust: "larger",
          backgroundColor: "rgba(255, 255, 255, 0.5)", // Standaard achtergrondkleur
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}
