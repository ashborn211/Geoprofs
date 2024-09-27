"use client";
import { useState } from "react";
import VerlofComponent from "../../components/verlof";
import CalendarComponent from "../../components/calendar";
import SearchBar from "../../components/SearchBar"; // Import SearchBar component
import "../../components/SearchBar.css"; // Import CSS for SearchBar

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Handle the date selected from the calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowPopup(true); // Open popup when a date is selected
  };

  // Handle search query results
  const handleSearchResults = (results: any[]) => {
    setSearchResults(results); // Store the search results
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-[6vw] bg-blue-500 h-full"></div>
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            <div className="col-span-12 row-span-4 col-start-1 bg-yellow-500 flex justify-between p-4">
              <div className="bg-red-500" style={{ width: "75%" }}>
                {/* Use the SearchBar here */}
                <SearchBar placeholder="Search Verlof/Vakantie" onSearch={handleSearchResults} />
                
                {/* Put results here */}
                <div className="search-results-container">
                  {searchResults.length > 0 ? (
                    <>
                      <h2>Search Results</h2>
                      <ul className="results-list">
                        {searchResults.map((result) => (
                          <li key={result.id} className="result-item">
                            <p><strong>Type:</strong> {result.type}</p>
                            <p><strong>Reason:</strong> {result.reason}</p>
                            <p><strong>Date Start:</strong> {result.dateStart}</p>
                            <p><strong>Date End:</strong> {result.dateEnd}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>No search results found.</p>
                  )}
                </div>
              </div>
              <div className="bg-red-500" style={{ width: "20%" }}></div>
            </div>

            <div className="col-span-12 row-span-8 col-start-1 row-start-5 bg-green-500 flex justify-center items-center">
              <div className="bg-white rounded-lg" style={{ width: "90%", height: "90%" }}>
                <CalendarComponent onDateSelect={handleDateSelect} />
              </div>
            </div>
          </div>
        </div>

        {/* Display the VerlofComponent popup when a date is selected */}
        {showPopup && selectedDate && (
          <VerlofComponent selectedDate={selectedDate} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </>
  );
}
