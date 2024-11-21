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
    const containerRef = useRef<HTMLDivElement>(null);
    const auth = getAuth(); // Haal de huidige ingelogde gebruiker op
    const currentUser = auth.currentUser; // Controleer of er een ingelogde gebruiker is

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
              const uid = data.uid; // Haal de uid van de eigenaar op

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
            // Alleen doorlopen als de uid overeenkomt met de huidige gebruiker
            if (uid === currentUser.uid) {
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
            }
          });
        }
      };

      highlightMatchingSpans();
    }, [dateRanges, currentUser]);


    const handleDateChange = (newValue: DateValue) => {
      setValue(newValue);

      const jsDate = new Date(newValue.toString());
      onDateSelect(jsDate);

      // Check if the selected date is within any date range
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
