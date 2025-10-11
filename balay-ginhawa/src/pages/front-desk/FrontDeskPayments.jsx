import { useState, useEffect } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";
import { db } from "../../config/firebase-config";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import * as XLSX from "xlsx"; // Added for Excel export

// Component na ginagamit sa bawat row ng table para sa actions (Add Charges at Checkout)
function PaymentActions({ guest, room, bookingId }) {
  const [showPopup, setShowPopup] = useState(false);
  const [chargeDesc, setChargeDesc] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");

  const handleSaveCharge = async () => {
    try {
      await addDoc(collection(db, "payments"), {
        bookingId,
        guestName: guest,
        roomNo: room,
        paymentType: "Additional Charge",
        description: chargeDesc,
        amount: Number(chargeAmount) || 0,
        date: serverTimestamp(),
      });

      setChargeDesc("");
      setChargeAmount("");
      setShowPopup(false);
      alert("Charge added successfully!");
    } catch (err) {
      console.error("Error saving charge:", err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={() => setShowPopup(true)}
        className="mt-1 w-full text-sm font-medium underline hover:text-gray-500"
      >
        + Add Charges
      </button>

      <button className="w-full px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
        Checkout
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-lg p-6 w-[400px] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Additional Charge</h2>

            <p className="mb-4">
              <strong>Guest:</strong> {guest} <br />
              <strong>Room:</strong> {room}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <input
              type="text"
              value={chargeDesc}
              onChange={(e) => setChargeDesc(e.target.value)}
              placeholder="Enter charge description..."
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount:
            </label>
            <input
              type="text"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="Enter amount..."
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

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

export function FrontDeskPayments() {
  const headers = [
    "Guest Name",
    "Room No.",
    "Room Type",
    "Payment Type",
    "Description",
    "Amount",
    "Date",
    "Action",
  ];

  const [rows, setRows] = useState([]);
  const [paymentsRaw, setPaymentsRaw] = useState([]);
  const [range, setRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "payments"), async (snapshot) => {
      const payments = await Promise.all(
        snapshot.docs.map(async (docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
      );
      setPaymentsRaw(payments);
    });

    return () => unsubscribe();
  }, []);

  const getRangeBounds = (r) => {
    const now = new Date();
    let from = null;
    let to = null;
    switch (r) {
      case "week":
        from = new Date();
        from.setDate(now.getDate() - 7);
        to = now;
        break;
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = now;
        break;
      case "6months":
        from = new Date();
        from.setMonth(now.getMonth() - 6);
        to = now;
        break;
      case "year":
        from = new Date();
        from.setFullYear(now.getFullYear() - 1);
        to = now;
        break;
      case "custom":
        from = customFrom ? new Date(customFrom) : null;
        to = customTo ? new Date(customTo) : null;
        break;
      default:
        from = null;
        to = null;
    }
    return { from, to };
  };

  const filterPaymentByRange = (p) => {
    const d = p.data.date?.toDate ? p.data.date.toDate() : p.data.date instanceof Date ? p.data.date : null;
    if (!d) return range === "all" || range === "";
    const { from, to } = getRangeBounds(range);
    if (!from && !to) return true;
    if (from && to) return d >= from && d <= to;
    if (from && !to) return d >= from;
    if (!from && to) return d <= to;
    return true;
  };

  useEffect(() => {
    const rowsBuilt = paymentsRaw.map((p) => {
      const data = p.data;

      let guestName = data.guestName || "Unknown";
      let roomNo = data.roomNo || "-";
      let roomTypeName = "-";

      const formattedDate = data.date?.toDate ? data.date.toDate().toLocaleDateString() : "N/A";

      return { id: p.id, display: [guestName, roomNo, roomTypeName, data.paymentType || "N/A", data.description || "-", data.amount ? `₱ ${data.amount}` : "₱ 0.00", formattedDate], raw: data };
    });

    const filtered = rowsBuilt.filter((r, i) => filterPaymentByRange(paymentsRaw[i]));
    const tableRows = filtered.map((r) => [...r.display, <PaymentActions key={r.id} guest={r.display[0]} room={r.display[1]} bookingId={r.raw?.bookingId} />]);
    setRows(tableRows);
  }, [paymentsRaw, range, customFrom, customTo]);

  // Updated CSV -> Excel download with adjusted column widths
  const downloadPaymentsCsv = () => {
    const filtered = paymentsRaw.filter(filterPaymentByRange);
    if (!filtered.length) {
      alert("No payment records to download for the selected range.");
      return;
    }

    const data = filtered.map((p) => {
      const d = p.data;
      const date = d.date?.toDate
        ? d.date.toDate().toLocaleString()
        : d.date instanceof Date
        ? d.date.toLocaleString()
        : "";
      return {
        ID: p.id,
        GuestName: d.guestName || "",
        RoomNo: d.roomNo || "",
        PaymentType: d.paymentType || "",
        Description: d.description || "",
        Amount: d.amount || 0,
        Date: date,
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Compute column widths based on longest text
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => String(row[key] || "").length)
      ) + 2,
    }));
    ws["!cols"] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");

    // Write to Excel file
    XLSX.writeFile(wb, `payments_${range || "all"}.xlsx`);
  };

  const rowsWithActions = rows.map((row, i) => [
    ...row.slice(0, 7),
    <PaymentActions key={i} guest={row[0]} room={row[1]} bookingId={row[7]} />,
  ]);

  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />

      <div className="flex">
        <FrontDeskSidePanel active="Payments" />
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Range:</label>
              <select value={range} onChange={(e) => setRange(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="all">All time</option>
                <option value="week">Last 7 days</option>
                <option value="month">This month</option>
                <option value="6months">Last 6 months</option>
                <option value="year">Last year</option>
                <option value="custom">Custom</option>
              </select>
              {range === "custom" && (
                <>
                  <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                  <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                </>
              )}
            </div>

            <button onClick={downloadPaymentsCsv} className="ml-auto px-3 py-1 bg-green-600 text-white rounded-sm text-sm hover:bg-green-700">Download Excel</button>
          </div>

          <Table headers={headers} rows={rowsWithActions} />
        </main>
      </div>
    </>
  );
}
