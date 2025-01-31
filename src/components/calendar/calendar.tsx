"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { db } from "@/FireBase/FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./calendar.css";
import { getLocalTimeZone, today, endOfMonth } from "@internationalized/date";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
  status: number;
  docId: string;
  uid: string;
}

export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const currentDate = today(getLocalTimeZone());
  const endOfCurrentMonth = endOfMonth(currentDate); // Bereken de laatste dag van de huidige maand

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

            ranges.push({ startDate, endDate, status, docId: doc.id, uid });
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
            for (
              let d = new Date(startDate);
              d <= endDate;
              d.setDate(d.getDate() + 1)
            ) {
              const day = d.getDate();
              const month = d.getMonth();
              const year = d.getFullYear();

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
      console.log(
        `Maand of jaar veranderd. Huidige maand/jaar: ${
          visibleMonth + 1
        }/${visibleYear}. Nieuwe maand/jaar: ${newMonth + 1}/${newYear}.`
      );

      setVisibleMonth(newMonth);
      setVisibleYear(newYear);

      // Force pagina reload
      console.log("Pagina wordt herladen...");
      window.location.href = window.location.href;
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        ref={containerRef}
        calendarWidth={1000}
        aria-label="Hij is er!"
        visibleMonths={1}
        //minValue={today(getLocalTimeZone())}
        maxValue={endOfCurrentMonth} // Beperk tot de laatste dag van de huidige maand
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
