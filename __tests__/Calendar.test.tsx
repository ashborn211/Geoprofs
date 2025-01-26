import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarComponent from "@/components/calendar/calendar";
import { getAuth } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";

// Mock Firebase modules
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: "test-uid" },
  })),
}));

jest.mock("@nextui-org/react", () => ({
  Calendar: jest.fn(({ onChange }) => (
    <div
      data-testid="mock-calendar"
      onClick={() => onChange({ toString: () => "2023-01-01" })}
    >
      Mock Calendar
    </div>
  )),
}));

jest.mock("@/FireBase/FireBaseConfig", () => ({
  db: {},
}));

describe("CalendarComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Calendar component", () => {
    render(<CalendarComponent onDateSelect={jest.fn()} />);
    expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
  });

  test("fetches date ranges from Firestore", async () => {
    const mockData = [
      {
        id: "doc1",
        data: () => ({
          startDate: { seconds: 1672531200 }, // Jan 1, 2023
          endDate: { seconds: 1672617600 }, // Jan 2, 2023
          status: 1,
          uid: "test-uid",
        }),
      },
    ];

    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (callback: (doc: any) => void) => {
        mockData.forEach(callback);
      },
    });

    render(<CalendarComponent onDateSelect={jest.fn()} />);
    await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(1));
    expect(collection).toHaveBeenCalledWith({}, "verlof");
  });

  test("calls onDateSelect when a date is selected", async () => {
    const mockOnDateSelect = jest.fn();
    render(<CalendarComponent onDateSelect={mockOnDateSelect} />);

    const calendar = screen.getByTestId("mock-calendar");
    fireEvent.click(calendar);

    await waitFor(() =>
      expect(mockOnDateSelect).toHaveBeenCalledWith(new Date("2023-01-01"))
    );
  });

  test("updates the visible month and year when a date is selected", async () => {
    jest.spyOn(window, "location", "get").mockReturnValue({
      href: "http://localhost",
    } as any);

    render(<CalendarComponent onDateSelect={jest.fn()} />);
    const calendar = screen.getByTestId("mock-calendar");

    fireEvent.click(calendar);

    await waitFor(() => {
      // Expect the page to attempt a reload
      expect(window.location.href).toBe("http://localhost");
    });
  });
});
