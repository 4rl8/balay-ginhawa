
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";

export function FrontDeskBookings() {
    const headers = ["Guest Name", "Check-in", "Check-out", "Status"];
    const rows = [
        ["Edloy Doe Kylle", "2025-09-11", "2025-11-11", "Confirmed"],
        ["EmmanW Smith", "2025-09-12", "2025-10-12", "Pending"],
    ];
  return (
    <>
        <title>balay Ginhawa</title>


            <FrontDeskHeader />

        
            <div className="flex">
                <FrontDeskSidePanel active="Bookings" />
                <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
                    <button className="px-5 py-2 bg-gray-300 text-black rounded-sm">Add Booking</button>

                    <Table headers={headers} rows={rows} />
                </main>
            </div>
    </>
    );
}