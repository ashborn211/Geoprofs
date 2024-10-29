"use client";
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  allData: any[];
  onSearch: (results: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ allData, onSearch }) => {
  const [queryText, setQueryText] = useState<string>("");

  useEffect(() => {
    onSearch(allData); // Show all data when component mounts
  }, [allData, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryText(e.target.value);
    filterResults(e.target.value);
  };

  const filterResults = (query: string) => {
    if (query.trim() === "") {
      onSearch(allData); // Show all data if no query
      return;
    }

    const filteredResults = allData.filter((item) => {
      const { name, type, startDate } = item;
      const lowerQuery = query.toLowerCase();

      return (
        name.toLowerCase().includes(lowerQuery) ||
        type.toLowerCase().includes(lowerQuery) ||
        (startDate && new Date(startDate).toLocaleDateString().includes(query))
      );
    });

    onSearch(filteredResults);
  };

  return (
    <div className="search-bar flex space-x-2">
      <input
        type="text"
        placeholder="Search by name, type, or date..."
        value={queryText}
        onChange={handleInputChange}
        className="search-input p-2 border rounded-lg"
      />
    </div>
  );
};

export default SearchBar;
