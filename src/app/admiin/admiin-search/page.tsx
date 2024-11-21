"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";
import Logout from "@/components/Logout";
import SearchBar from "@/components/SearchBar";
import ResultsTable from "@/components/ResultsTable";

export default function AdminSearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);

  // Fetch all data from Firestore when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "verlof"));
        const results: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            id: doc.id,
            name: data.name,
            reason: data.reason,
            startDate: data.startDate, // Firestore timestamp
            endDate: data.endDate, // Assuming endDate exists, or null if missing
            status: data.status,
            type: data.type,
            uid: data.uid,
          });
        });
        setAllData(results);
        setSearchResults(results); // Set the initial results to all data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter the results based on the search queries
  const handleSearch = (nameQuery: string, typeQuery: string, dateQuery: string) => {
    const filteredResults = allData.filter((item) => {
      const lowerName = nameQuery.toLowerCase();
      const lowerType = typeQuery.toLowerCase();
      const lowerDate = dateQuery.toLowerCase();
      const itemName = item.name.toLowerCase();
      const itemType = item.type.toLowerCase();

      // Convert Firestore timestamp to string (MM/DD)
      const itemStartDate = new Date(item.startDate.seconds * 1000).toLocaleDateString();

      // Match name, type, and date (startDate) with the queries
      const matchesName = nameQuery ? itemName.includes(lowerName) : true;
      const matchesType = typeQuery ? itemType.includes(lowerType) : true;
      const matchesDate = dateQuery ? itemStartDate.startsWith(lowerDate) : true;

      return matchesName && matchesType && matchesDate;
    });

    setSearchResults(filteredResults); // Update the search results
  };

  return (
    <div className="flex h-screen overflow-hidden bg-custom-gray">
      <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
        <Logout />
      </div>

      {/* Main Content */}
      <div className="w-[94vw] h-full">
        <div className="h-full grid grid-cols-12 grid-rows-12">
          {/* Header */}
          <div className="col-span-12 row-span-4 bg-custom-gray-500 flex justify-around items-center p-4">
            <div
              className="rounded-lg text-4xl flex items-center justify-center p-4"
              style={{
                width: "65%",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,1) 16%, rgba(90,209,254,1) 100%)",
              }}
            >
              <h1>Welcome, Admin</h1>
            </div>

            <div className="w-[20%]">
              <div
                className="w-full h-[75%] bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/Logo GeoProfs.png')",
                }}
              ></div>
            </div>
          </div>

          {/* Admin Functions */}
          <div className="col-span-12 row-span-8 bg-custom-gray-500 p-8 flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Blue Table to Display Results */}
            <div className="bg-blue-500 p-4 rounded-lg">
              <ResultsTable data={searchResults} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
