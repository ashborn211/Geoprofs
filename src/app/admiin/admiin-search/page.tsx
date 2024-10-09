"use client";
import { useEffect, useState } from "react";
import { Link } from "@nextui-org/react";
import SearchBar from "../../../components/SearchBar";
import ResultsTable from "../../../components/ResultsTable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../FireBaseConfig";
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
          results.push({ id: doc.id, ...doc.data() });
        });
        setAllData(results);
        setSearchResults(results); // Set the initial results to all data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter the results based on the search query
  const handleSearch = (filteredResults: any[]) => {
    setSearchResults(filteredResults);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        {/* Sidebar */}
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
          <Link href="./" className="text-white underline mb-4">
            Log out
          </Link>
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
                <SearchBar allData={allData} onSearch={handleSearch} />
              </div>

              {/* Blue Table to Display Results */}
              <div className="bg-blue-500 p-4 rounded-lg">
                <ResultsTable data={searchResults} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
