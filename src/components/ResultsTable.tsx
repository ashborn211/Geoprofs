import React from "react";
import { convertTimestampToString } from "@/utils/convertTimestampToString"; // Import the utility function

interface ResultsTableProps {
  data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-white">No results found.</p>;
  }

  return (
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
        {data.map((row, index) => (
          <tr key={index} className="bg-blue-600 border-b border-blue-800">
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.type}</td>
            <td className="p-2">{row.reason}</td>
            <td className="p-2">
              {convertTimestampToString(row.startDate)} -{" "}
              {convertTimestampToString(row.endDate)}
            </td>
            <td className="p-2">{row.uid}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
