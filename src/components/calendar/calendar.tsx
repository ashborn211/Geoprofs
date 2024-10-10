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

export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const [value, setValue] = useState<DateValue | null>(null);
  const [startDates, setStartDates] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

        startDates.forEach((date) => {
          const matchingSpans = Array.from(spans).filter(
            (span) => span.textContent === `${date}`
          );

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

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate);
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
