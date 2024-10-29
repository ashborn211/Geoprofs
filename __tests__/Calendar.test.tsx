// src/components/__tests__/calendar.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import CalendarComponent from "../src/components/calendar/calendar";
import "@testing-library/jest-dom";

describe("CalendarComponent", () => {
  it("renders the Calendar component with the correct label", () => {
    // Render de CalendarComponent
    render(<CalendarComponent onDateSelect={() => {}} />);

    // Controleer of het element met het label 'Date (Min Date Value)' in de document aanwezig is
    expect(screen.getByLabelText("Hij is er!")).toBeInTheDocument();
  });
});
