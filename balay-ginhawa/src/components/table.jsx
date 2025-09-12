// A reusable Table component with sortable columns -KhyteGpt

//Function neto is matandaan kung anong column yung na sort at kung anong shit asc or desc
import { useState } from "react";


export default function Table({ headers, rows }) {
    //sortConfig state na need matandaan
    //key is an index column name
    //setSortConfig is updater nung sortConfig state pag nag click ng header    
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    //getComparator is nag cecreate ng bagong function
    //Kase need ng getComparator yung Array Sort func with the format from a,b or number
    //So everytime na gamitin si getComparator(key) ay mag babalik ng function na 
    //Kayang i compare ng 2 rows a at b base sa column index na itinutukoy ni {key} na pinindot natin

    //Basically si getComparator is gagawa ng function
    //Si key ang magsasabi kung saan gagamitin si function
    //at yung ibinalik na function is process na gagamitin ng Array Sort(a,b) rows para maayos ang mga rows
  const getComparator = (key) => {
    return (a, b) => {
    //pagkuhan ng value sa row a at b base sa column index na key
      const valA = a[key];
      const valB = b[key];

    //Pang both walang laman then null or return 0
    //Kung si valA is null then ilagay sa dulo, then valB sa una
    //Kung si valB is null then ilagay sa dulo, then valA sa una
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

    //Gagawing string regardless kung number man or text also trim spaces sa unahan at dulo
      const sA = String(valA).trim();
      const sB = String(valB).trim();

    //replace(/,/g, "") - Tinatanggal lahat ng comma sa string
    //parseFloat - Ginagawang number kung kaya
      const nA = Number.parseFloat(sA.replace(/,/g, ""));
      const nB = Number.parseFloat(sB.replace(/,/g, ""));

    //Check kung number ba si nA at nB
    //pag hindi return NaN pag oo return Finite
    //So kung pareho silang number gagawin na number comparison
    //Kung hindi sila pareho ng type gagamitin ang localeCompare para sa string comparison
      const isNumA = !Number.isNaN(nA) && Number.isFinite(nA);
      const isNumB = !Number.isNaN(nB) && Number.isFinite(nB);

    //If number comparison pag negative ang result si A mauuna pag postive naman si B mauuna
      if (isNumA && isNumB) {
        return nA - nB;
      }

    //If string comparison gagamit ng localeCompare
    //Ginagamit si localeCompare para maayos ang string na may kasamang number
    //Sensitivity base para hindi case sensitive yung comparison
      return sA.localeCompare(sB, undefined, { numeric: true, sensitivity: "base" });
    };
  };

  //let sortedRows is a copy of rows so kopya lang siya para hindi maapektuhan yung original rows
  let sortedRows = [...rows];
  //if sortConfig.key is not null or walang laman or di napindot then as is lang siya pero ichecheck niya muna
  if (sortConfig.key !== null) {
  //ginamit ang getComparator para makuha yung function na gagamitin sa sorting
    sortedRows.sort(getComparator(sortConfig.key));
    if (sortConfig.direction === "desc") {
      sortedRows.reverse();
    }
  }

  //handleSort is function na tinatawag pag pinindot ang header
  //index is yung column index na pinindot
  const handleSort = (index) => {
  //if sortConfig.key is same sa index na pinindot, then mag totoggle lang from asc to desc to null
  //if di naman same, then iseset siya sa asc
    if (sortConfig.key === index) {
  //direction of toggle from asc to desc to null to asc ulit
      let nextDirection =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
          ? null
          : "asc";
  //update kay sortConfig gamit si setSortConfig
      setSortConfig({ key: index, direction: nextDirection });
    } else {
      setSortConfig({ key: index, direction: "asc" });
    }
  };

  //getArrow is function na nagbabalik ng arrow symbol base sa sortConfig state
  const getArrow = (index) => {
  //pag di naka sort sa column na yan, then return "⇅"
    if (sortConfig.key !== index) return "⇅";
  //kung naka sort siya sa column na yan, then check direction then return asc and so on
    if (sortConfig.direction === "asc") return "↑";
    if (sortConfig.direction === "desc") return "↓";
    return "⇅";
  };

  return (
    <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md mt-4 text-center">
      <thead className="bg-white">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              onClick={() => handleSort(index)}
              className="border px-4 py-2 font-semibold cursor-pointer select-none"
            >
              {header} {getArrow(index)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border px-4 py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
