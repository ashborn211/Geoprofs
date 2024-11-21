import React from "react";

interface ResultsTableProps {
  data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-white">No results found.</p>;
  }

  // Check and convert Firestore timestamp to readable date string
  const convertTimestampToString = (timestamp: any) => {
    if (!timestamp) {
      console.error("Invalid timestamp:", timestamp); // Log invalid timestamp
      return "Invalid Date"; // Return a fallback message if timestamp is missing
    }

    // Check if the timestamp is a Firestore Timestamp
    if (
      timestamp.seconds === undefined ||
      timestamp.nanoseconds === undefined
    ) {
      console.error("Invalid Firestore Timestamp:", timestamp); // Log invalid Firestore Timestamp
      return "Invalid Date"; // Return a fallback message if not a valid Firestore Timestamp
    }

    // Convert Firestore timestamp to JavaScript Date
    const date = new Date(timestamp.seconds * 1000); // Firestore Timestamp to JS Date
    if (isNaN(date.getTime())) {
      console.error("Invalid Date object:", date); // Log if date conversion fails
      return "Invalid Date"; // Return a fallback message if conversion fails
    }

    return date.toLocaleDateString(); // Convert to local date string
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-white">
        <thead>
          <tr className="bg-blue-700">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Start Date - End Date</th>
            <th className="p-2 text-left">User ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-blue-600 border-b border-blue-800">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">{item.reason}</td>
              <td className="p-2">
                {convertTimestampToString(item.startDate)} -{" "}
                {convertTimestampToString(item.endDate)}
              </td>
              <td className="p-2">{item.uid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
