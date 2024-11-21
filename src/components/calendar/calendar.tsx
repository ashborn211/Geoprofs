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
            // Loop door alle dagen in het bereik tussen startDate en endDate
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

    // Controleer of de zichtbare maand is veranderd
    const newMonth = jsDate.getMonth();
    const newYear = jsDate.getFullYear();

    if (newMonth !== visibleMonth || newYear !== visibleYear) {
      console.log(
        `De maand is veranderd naar: ${jsDate.toLocaleString("default", {
          month: "long",
        })} ${newYear}`
      );
      setVisibleMonth(newMonth);
      setVisibleYear(newYear);
    }

    // Controleer of de geselecteerde datum binnen een van de datumbereiken valt
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

  // Gebruik onVisibleRangeChange om de pagina te herladen bij navigeren naar een andere maand
  const handleVisibleRangeChange = ({ start, end }: { start: Date; end: Date }) => {
    // Als de maand verandert (door navigatie met de pijltjes), herlaad de pagina
    const newMonth = start.getMonth();
    const newYear = start.getFullYear();

    if (newMonth !== visibleMonth || newYear !== visibleYear) {
      console.log(`De maand is veranderd naar: ${newMonth + 1}/${newYear}. De pagina wordt herladen.`);
      window.location.reload(); // Herlaad de pagina
    }

    setVisibleMonth(newMonth);
    setVisibleYear(newYear);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        ref={containerRef} // Koppel de kalender aan de ref
        calendarWidth={1000}
        aria-label="Hij is er!" // Toegankelijkheid label
        visibleMonths={1} // Toon 1 maand per keer
        minValue={today(getLocalTimeZone())} // De minimale datum die kan worden geselecteerd is vandaag
        value={value} // De geselecteerde waarde
        onChange={handleDateChange} // De functie die wordt aangeroepen bij wijziging van de geselecteerde datum
        onVisibleRangeChange={handleVisibleRangeChange} // De functie die wordt aangeroepen bij wijziging van de zichtbare maand
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
