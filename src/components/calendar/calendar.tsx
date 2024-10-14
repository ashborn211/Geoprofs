"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { db } from "../../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./calendar.css";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
  status: number;
  docId: string; // Voeg docId toe aan DateRange
}

export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const [value, setValue] = useState<DateValue | null>(null);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const ranges: DateRange[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.startDate?.seconds && data.endDate?.seconds) {
            const startDate = new Date(data.startDate.seconds * 1000);
            const endDate = new Date(data.endDate.seconds * 1000); // Get endDate
            const status = data.status;

            console.log(
              `Document ${doc.id} heeft de startdatum: ${startDate.getDate()} en einddatum: ${endDate.getDate()} met status: ${status}`
            );

            // Voeg docId toe aan het DateRange object
            ranges.push({ startDate, endDate, status, docId: doc.id });
          } else {
            console.warn(`Document ${doc.id} mist startDate of endDate.`);
          }
        });
        setDateRanges(ranges);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchAllDates();
  }, []);

  useEffect(() => {
    const highlightMatchingSpans = () => {
      if (containerRef.current) {
        const spans = containerRef.current.querySelectorAll("span");

        dateRanges.forEach(({ startDate, endDate, status }) => {
          // Loop through all days in the range between startDate and endDate
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const day = d.getDate();
            const matchingSpans = Array.from(spans).filter(
              (span) => span.textContent === `${day}`
            );

            matchingSpans.forEach((span) => {
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

            console.log(
              `Aantal spans met waarde "${day}" en status "${status}": ${matchingSpans.length}`
            );
          }
        });
      }
    };

    highlightMatchingSpans();
  }, [dateRanges]);

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate);

    // Check if the selected date is within any date range
    const selectedDate = dateRanges.find(
      ({ startDate, endDate }) => jsDate >= startDate && jsDate <= endDate
    );

    if (selectedDate) {
      // Log de datum, status en docId
      console.log(
        `Deze datum van staat al in de database: ${jsDate.toDateString()} met status: ${selectedDate.status} en document ID: ${selectedDate.docId}`
      );
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
