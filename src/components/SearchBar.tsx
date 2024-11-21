"use client";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (nameQuery: string, typeQuery: string, dateQuery: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [nameQuery, setNameQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    setter(value); // Update the corresponding query state
  };

  // Trigger search when the user changes the input
  const handleSearch = () => {
    onSearch(nameQuery, typeQuery, dateQuery);
  };

  return (
    <div className="search-bar flex space-x-2">
      <input
        type="text"
        placeholder="Search by name"
        value={nameQuery}
        onChange={(e) => handleInputChange(e, setNameQuery)}
        className="search-input p-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Search by type"
        value={typeQuery}
        onChange={(e) => handleInputChange(e, setTypeQuery)}
        className="search-input p-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Search by date"
        value={dateQuery}
        onChange={(e) => handleInputChange(e, setDateQuery)}
        className="search-input p-2 border rounded-lg"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
