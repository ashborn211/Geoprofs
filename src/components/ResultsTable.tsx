import React from "react";

interface ResultsTableProps {
  data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-white">No results found.</p>;
  }

  // Convert Firestore timestamp to readable date
  const convertTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-white">
        <thead>
          <tr className="bg-blue-700">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">User ID</th> {/* Change ID to User ID */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.userId} className="bg-blue-600 border-b border-blue-800">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">{item.reason}</td>
              <td className="p-2">
                {item.startTime} - {item.endTime},{" "}
                {convertTimestamp(item.startDate)} {/* Convert timestamp */}
              </td>
              <td className="p-2">{item.userId}</td> {/* Display userId */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
