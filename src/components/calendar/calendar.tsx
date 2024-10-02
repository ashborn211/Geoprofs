"use client";

import React from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import './calendar.css';

export default function CalendarComponent() {
  let [value, setValue] = React.useState<DateValue | null>(null); // Initialiseer zonder waarde

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
