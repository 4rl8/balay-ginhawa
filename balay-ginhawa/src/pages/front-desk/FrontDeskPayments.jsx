
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";

export function FrontDeskPayments() {
    const headers = ["Guest Name","Room No.", "Payment Type", "Description", "Amount", "Date", "Action"];
    const rows = [
        ["Edloy Doe Kylle","101", "Cash", "Room Payment", "₱ 1,500.00", "2025-09-11", "View"],
        ["EmmanW Smith","102", "Gcash", "Room Payment", "₱ 1,500.00", "2025-09-12", "View"],
        ["John Edloy Smith","69", "Affection", "Loving System ANALyst", "Free", "2025-09-12", "Any"],

    ];
  return (
    <>
        <title>balay Ginhawa</title>


            <FrontDeskHeader />


            <div className="flex">
                <FrontDeskSidePanel active="Payments" />
                <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
                    <Table headers={headers} rows={rows} />
                </main>

            </div>
    </>
    );
}