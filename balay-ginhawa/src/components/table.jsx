import { useState } from "react";

export default function Table({ headers, rows }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Function to handle sorting when a header is clicked
  const handleSort = (index) => {
    if (sortConfig.key === index) {
      // Toggle direction: asc → desc → null → asc ...
      const nextDirection =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
          ? null
          : "asc";
      setSortConfig({ key: index, direction: nextDirection });
    } else {
      setSortConfig({ key: index, direction: "asc" });
    }
  };

  // Arrow for header
  const getArrow = (index) => {
    if (sortConfig.key !== index) return "⇅";
    if (sortConfig.direction === "asc") return "↑";
    if (sortConfig.direction === "desc") return "↓";
    return "⇅";
  };

  // Sorting logic
  let sortedRows = [...rows];
  if (sortConfig.key !== null && sortConfig.direction) {
    const key = sortConfig.key;
    const dir = sortConfig.direction;

    sortedRows.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Skip sorting if column contains React element
      if (typeof valA === "object" || typeof valB === "object") return 0;

      // Check if values are dates
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dir === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Check if values are numbers
      const nA = parseFloat(String(valA).replace(/,/g, ""));
      const nB = parseFloat(String(valB).replace(/,/g, ""));
      const isNumA = !isNaN(nA);
      const isNumB = !isNaN(nB);
      if (isNumA && isNumB) {
        return dir === "asc" ? nA - nB : nB - nA;
      }

      // Fallback to string comparison
      return dir === "asc"
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: "base" })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true, sensitivity: "base" });
    });
  }

  return (
    <div className="shadow-md mt-4 bg-white rounded-xl overflow-x-auto">
      <table className="min-w-full text-center border-collapse">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                className="px-4 py-2 font-semibold cursor-pointer select-none first:rounded-tl-xl last:rounded-tr-xl"
              >
                {header} {getArrow(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
