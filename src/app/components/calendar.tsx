"use client"

import React from "react";
import {Calendar} from "@nextui-org/react";
import type {DateValue} from "@react-types/calendar";
import {parseDate} from "@internationalized/date";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function CalendarComponent() {
  let [value, setValue] = React.useState<DateValue>(parseDate("2024-03-07"));

  return (
    <>
      <Calendar
        aria-label="Date (Min Date Value)"
        visibleMonths={3}
        defaultValue={today(getLocalTimeZone())}
        minValue={today(getLocalTimeZone())}
        style={{
          fontSize: "20px",          // Tekstgrootte
          letterSpacing: "0px",      // Meer ruimte tussen letters
          padding: "10px",           // Padding binnen de kalender
          width: "100%",            // Breedte van de kalender aanpassen
          height: "100%"
        }}
      />
    </>
  );
}