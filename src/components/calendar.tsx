"use client";

import React from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void; // Callback to send selected date to parent
}

export default function CalendarComponent({ onDateSelect }: CalendarComponentProps) {
  const [value, setValue] = React.useState<DateValue | null>(null);

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    // Convert DateValue to JavaScript Date
    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate); // Send the selected date to the parent component
  };

  return (
    <>
      <Calendar
        aria-label="Date Picker"
        visibleMonths={3}
        defaultValue={today(getLocalTimeZone())}
        minValue={today(getLocalTimeZone())}
        value={value}
        onChange={handleDateChange} // Handle date changes
        style={{
          fontSize: "20px",         // Text size
          letterSpacing: "0px",     // Letter spacing
          padding: "10px",          // Padding inside the calendar
          width: "100%",            // Adjust calendar width
          height: "100%",
        }}
      />
    </>
  );
}
