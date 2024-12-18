"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { db } from "@/FireBase/FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Authentication import
import "./calendar.css";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
  status: number;
  docId: string;
  uid: string; // Voeg de uid van de eigenaar toe aan DateRange
}

export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const [value, setValue] = useState<DateValue | null>(null);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [visibleMonth, setVisibleMonth] = useState<number>(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState<number>(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchAllDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const ranges: DateRange[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.startDate?.seconds && data.endDate?.seconds && data.uid) {
            const startDate = new Date(data.startDate.seconds * 1000);
            const endDate = new Date(data.endDate.seconds * 1000);
            const status = data.status;
            const uid = data.uid;

            console.log(
              `Document ${doc.id} heeft de startdatum: ${startDate.getDate()} en einddatum: ${endDate.getDate()} met status: ${status} en uid: ${uid}`
            );

            ranges.push({ startDate, endDate, status, docId: doc.id, uid });
          } else {
            console.warn(`Document ${doc.id} mist startDate, endDate of uid.`);
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
      if (containerRef.current && currentUser) {
        const spans = containerRef.current.querySelectorAll("span");

        dateRanges.forEach(({ startDate, endDate, status, uid }) => {
          if (uid === currentUser.uid) {
            // Loop door het bereik van datums
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              const day = d.getDate();
              const month = d.getMonth();
              const year = d.getFullYear();

              // Alleen als de datum overeenkomt met de zichtbare maand en jaar
              if (month === visibleMonth && year === visibleYear) {
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
            }
          }
        });
      }
    };

    highlightMatchingSpans();
  }, [dateRanges, currentUser, visibleMonth, visibleYear]);

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate);

    const newMonth = jsDate.getMonth();
    const newYear = jsDate.getFullYear();

    if (newMonth !== visibleMonth || newYear !== visibleYear) {
      setVisibleMonth(newMonth);
      setVisibleYear(newYear);
    }

    const selectedDate = dateRanges.find(
      ({ startDate, endDate, uid }) =>
        jsDate >= startDate && jsDate <= endDate && uid === currentUser?.uid
    );

    if (selectedDate) {
      console.log(
        `Deze datum staat al in de database: ${jsDate.toDateString()} met status: ${selectedDate.status} en document ID: ${selectedDate.docId}`
      );
    }
  };

  const handleVisibleRangeChange = ({ start }: { start: Date }) => {
    const newMonth = start.getMonth();
    const newYear = start.getFullYear();

    if (newMonth !== visibleMonth || newYear !== visibleYear) {
      console.log(`De maand is veranderd naar: ${newMonth + 1}/${newYear}`);
      setVisibleMonth(newMonth);
      setVisibleYear(newYear);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        ref={containerRef}
        calendarWidth={1000}
        aria-label="Hij is er!"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value}
        onChange={handleDateChange}
        onVisibleRangeChange={handleVisibleRangeChange}
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
