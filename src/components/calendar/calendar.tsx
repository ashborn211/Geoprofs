"use client"

import React from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { parseDate } from "@internationalized/date";
import { today, getLocalTimeZone } from "@internationalized/date";
import './calendar.css';
export default function CalendarComponent() {
  let [value, setValue] = React.useState<DateValue>(parseDate("2024-03-07"));

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        defaultValue={today(getLocalTimeZone())}
        minValue={today(getLocalTimeZone())}
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
