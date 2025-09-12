import { FrontDeskHeader } from "../components/FrontDeskHeader";
import { FrontDeskSidePanel } from "../components/FrontDeskSidePanel";
import Table from "../components/Table";

export function FrontDeskRooms() {
    const headers = ["Room No.", "Type", "Status", "Guest", "Check Out Data", "Statys"];
    const rows = [
        ["101", "Single", "Occupied", "Edloy Doe Kylle", "2025-09-11", "Check Out"],
        ["102", "Double", "Vacant", "-", "-", "-"],
    ];
  return (
    <>
        <title>balay Ginhawa</title>


            <FrontDeskHeader />


            <div className="flex">
                <FrontDeskSidePanel active="Rooms" />
                <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
                    <Table headers={headers} rows={rows} />
                </main>

            </div>
    </>
    );
}