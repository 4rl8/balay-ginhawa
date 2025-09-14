import { useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";

//Component para sa actions per row, Add Charges at View button
function PaymentActions({ guest, room }) {
  //State para sa popup visibility
  const [showPopup, setShowPopup] = useState(false);

  //State para sa input fields ng additional charge
  const [chargeDesc, setChargeDesc] = useState("");   // description field
  const [chargeAmount, setChargeAmount] = useState(""); // amount field

  //Function na magsasave ng charge (demo: console.log lang muna)
  const handleSaveCharge = () => {
    console.log("New charge for:", guest, room);
    console.log("Description:", chargeDesc, "Amount:", chargeAmount);

    //Reset fields after saving
    setChargeDesc("");
    setChargeAmount("");

    //Isara popup pagkatapos magsave
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      {/*Add Charges link na magbubukas ng popup */}
      <button
        onClick={() => setShowPopup(true)}
        className=" mt-1 w-full text-sm font-medium underline hover:text-gray-500"
      >
        + Add Charges
      </button>

      {/* View button para sa checkout, wala pang function */}
      <button className="w-full px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
        Checkout
      </button>

      {/*Popup component lalabas lang kapag showPopup = true */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Popup container */}
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-lg p-6 w-[400px] relative">
            
            {/* Close button) */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Popup Title */}
            <h2 className="text-lg font-semibold mb-4">Add Additional Charge</h2>

            {/* Display ng Guest at Room (dynamic values galing sa row) */}
            <p className="mb-4">
              <strong>Guest:</strong> {guest} <br />
              <strong>Room:</strong> {room}
            </p>

            {/* Input field para sa Description */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <input
              type="text"
              value={chargeDesc}
              onChange={(e) => setChargeDesc(e.target.value)} // update state on change
              placeholder="Enter charge description..."
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            {/* Input field para sa Amount */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount:
            </label>
            <input
              type="text"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)} // update state on change
              placeholder="Enter amount..."
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            {/* Save button, tatawag sa handleSaveCharge */}
            <button
              onClick={handleSaveCharge}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Charge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component para sa Payments Page
export function FrontDeskPayments() {
  // Table headers (static)
  const headers = [
    "Guest Name",
    "Room No.",
    "Payment Type",
    "Description",
    "Amount",
    "Date",
    "Action",
  ];

  // Sample data rows (mock data for now)
  const [rows] = useState([
    ["Edloy Doe Kylle", "101", "Cash", "Room Payment", "₱ 1,500.00", "2025-09-11"],
    ["EmmanW Smith", "102", "Gcash", "Room Payment", "₱ 1,500.00", "2025-09-12"],
  ]);

  // Dinadagdagan ng PaymentActions component sa bawat row (last column = Action)
  const rowsWithActions = rows.map((row, i) => [
    ...row,
    <PaymentActions key={i} guest={row[0]} room={row[1]} />, // guest at room ay props
  ]);

  return (
    <>
      {/* Page title */}
      <title>balay Ginhawa</title>

      {/* Header component (top bar) */}
      <FrontDeskHeader />

      <div className="flex">
        {/* Sidebar component (with active link = Payments) */}
        <FrontDeskSidePanel active="Payments" />

        {/* Main content area */}
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Table component with headers at rows */}
          <Table headers={headers} rows={rowsWithActions} />
        </main>
      </div>
    </>
  );
}
