"use client"
import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FireBaseConfig"; // Adjust the path as needed

interface SearchBarProps {
    placeholder?: string;
    onSearch: (results: any[]) => void;
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
    const [queryText, setQueryText] = useState<string>("");
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQueryText(e.target.value);
    };
  
    const handleSearch = async () => {
      if (queryText.trim() === "") return;
  
      try {
        const q = query(
          collection(db, "verlof"), // Change "verlof" to your collection name
          where("type", "==", queryText) // Searching by 'type' (e.g., "vakantie", "verlof")
        );
  
        const querySnapshot = await getDocs(q);
        const results: any[] = [];
  
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
  
        onSearch(results); // Send the fetched results back to the parent component
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder={placeholder}
          value={queryText}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
    );
  };
  
  export default SearchBar;