import { useState, useMemo } from "react";

export default function Table({ headers, rows }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 🧭 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Default 20 per page

  // Handle sorting
  const handleSort = (index) => {
    if (sortConfig.key === index) {
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

  // Get arrow indicator
  const getArrow = (index) => {
    if (sortConfig.key !== index) return "⇅";
    if (sortConfig.direction === "asc") return "↑";
    if (sortConfig.direction === "desc") return "↓";
    return "⇅";
  };

  // 🧠 useMemo for efficient sorting
  const sortedRows = useMemo(() => {
    let temp = [...rows];
    if (sortConfig.key !== null && sortConfig.direction) {
      const key = sortConfig.key;
      const dir = sortConfig.direction;

      temp.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === "object" || typeof valB === "object") return 0;

        const dateA = new Date(valA);
        const dateB = new Date(valB);
        if (!isNaN(dateA) && !isNaN(dateB))
          return dir === "asc" ? dateA - dateB : dateB - dateA;

        const nA = parseFloat(String(valA).replace(/,/g, ""));
        const nB = parseFloat(String(valB).replace(/,/g, ""));
        const isNumA = !isNaN(nA);
        const isNumB = !isNaN(nB);
        if (isNumA && isNumB) return dir === "asc" ? nA - nB : nB - nA;

        return dir === "asc"
          ? String(valA).localeCompare(String(valB), undefined, {
              numeric: true,
              sensitivity: "base",
            })
          : String(valB).localeCompare(String(valA), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      });
    }
    return temp;
  }, [rows, sortConfig]);

  // 🧩 Pagination logic
  const totalPages =
    rowsPerPage === "all" ? 1 : Math.ceil(sortedRows.length / rowsPerPage);
  const startIndex =
    rowsPerPage === "all" ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex =
    rowsPerPage === "all"
      ? sortedRows.length
      : startIndex + Number(rowsPerPage);
  const currentRows = sortedRows.slice(startIndex, endIndex);

  // 🧭 When rowsPerPage changes, reset to page 1
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setCurrentPage(1);
  };

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
          {currentRows.map((row, rowIndex) => (
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

      {/* 🧭 Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="all">Show All</option>
          </select>
        </div>

        {rowsPerPage !== "all" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
