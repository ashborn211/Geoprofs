"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { db } from "../../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./calendar.css";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void; // Callback to send selected date to parent
}

interface StartDate {
  day: number;
  status: number;
}

export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const [value, setValue] = useState<DateValue | null>(null);
  const [startDates, setStartDates] = useState<StartDate[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllStartDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const dates: StartDate[] = [];
        querySnapshot.forEach((doc) => {
          const startDate = new Date(doc.data().startDate.seconds * 1000);
          const status = doc.data().status; // Get the status from the document
          const documentId = doc.id;

          console.log(
            `${documentId} heeft de startdatum: ${startDate.getDate()} met status: ${status}`
          );

          // Push the date and status as an object
          dates.push({ day: startDate.getDate(), status });
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

        startDates.forEach(({ day, status }) => {
          const matchingSpans = Array.from(spans).filter(
            (span) => span.textContent === `${day}`
          );

          matchingSpans.forEach((span) => {
            // Set the color based on the status value
            switch (status) {
              case 1:
                span.style.backgroundColor = "orange";
                span.style.color = "white";
                break;
              case 2:
                span.style.backgroundColor = "green";
                span.style.color = "white";
                break;
              case 3:
                span.style.backgroundColor = "red";
                span.style.color = "white";
                break;
              default:
                span.style.backgroundColor = "transparent";
                span.style.color = "black";
                break;
            }
          });

          console.log(`Aantal spans met waarde "${day}" en status "${status}": ${matchingSpans.length}`);
        });
      }
    };

    highlightMatchingSpans();
  }, [startDates]);

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate);

    // Check if the selected date is in the startDates array
    const selectedDay = jsDate.getDate(); // Get the day of the month from the selected date
    const selectedDate = startDates.find((date) => date.day === selectedDay);

    if (selectedDate) {
      console.log(`Deze datum staat al in de database: ${jsDate.toDateString()} met status: ${selectedDate.status}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        ref={containerRef}
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value}
        onChange={handleDateChange}
        style={{
          fontSize: "23px",
          boxShadow: "none",
          textSizeAdjust: "larger",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}
