"use client";

import React from "react";
import { Calendar } from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import "./calendar.css";

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void; // Callback to send selected date to parent
}
export default function CalendarComponent({
  onDateSelect,
}: CalendarComponentProps) {
  const [value, setValue] = React.useState<DateValue | null>(null);

  const handleDateChange = (newValue: DateValue) => {
    setValue(newValue);

    // Convert DateValue to JavaScript Date
    const jsDate = new Date(newValue.toString());
    onDateSelect(jsDate); // Send the selected date to the parent component
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        calendarWidth={1000}
        aria-label="Date (Min Date Value)"
        visibleMonths={1}
        minValue={today(getLocalTimeZone())}
        value={value} // Gebruikt de state om geselecteerde waarde te beheren
        onChange={handleDateChange} // Update de waarde wanneer een datum geselecteerd wordt
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
