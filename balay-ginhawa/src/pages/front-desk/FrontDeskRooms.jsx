
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import { useState } from "react";

import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";

export function FrontDeskRooms() {
    const headers = ["Room No.", "Type", "Status", "Guest", "Check Out Data", "Change Status", ];

    const [rows, setRows] = useState ([
        ["101", "Single", "Occupied", "Edloy Doe Kylle", "2025-09-11"],
        ["102", "Double", "Vacant", "-", "-"],
    ]);

    const handleStatusChange = (rowIndex, newStatus) => {
        setRows(prevRows => 
            prevRows.map((row, i) =>
                i === rowIndex ? [...row.slice(0, 2), newStatus, ...row.slice(3)] : row
            )
        );
    };

    const rowsWithDropdown = rows.map((row, i) => [
        ...row,
        <Dropdown key={i} roomNo={row[0]} onSelect={(value) => handleStatusChange(i, value)} />
    ]);

  return (
    <>
        <title>balay Ginhawa</title>

            <FrontDeskHeader />

            <div className="flex">
                <FrontDeskSidePanel active="Rooms" />
                <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
                    <Table headers={headers} rows={rowsWithDropdown} />
                </main>

            </div>
    </>
    );
}