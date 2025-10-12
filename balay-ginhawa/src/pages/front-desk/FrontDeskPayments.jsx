import { useState, useEffect } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";
import { db } from "../../config/firebase-config";
import { collection, addDoc, serverTimestamp, onSnapshot,} from "firebase/firestore";
import * as XLSX from "xlsx";

// --- Actions for each row (Add Charges + Checkout) ---
function PaymentActions({ bookingId, name, room }) {
  const [showPopup, setShowPopup] = useState(false);
  const [chargeDesc, setChargeDesc] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");

  const handleSaveCharge = async () => {
    if (!chargeDesc || !chargeAmount) return alert("Please enter description and amount");

    try {
      await addDoc(collection(db, "payments"), {
        bookingId,
        name,
        roomId: room,
        paymentType: "Additional Charge",
        description: chargeDesc,
        amount: Number(chargeAmount),
        date: serverTimestamp(),
      });

      setChargeDesc("");
      setChargeAmount("");
      setShowPopup(false);
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
              <strong>Guest:</strong> {name} <br />
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
              type="number"
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

// --- Main Payments Table ---
export function FrontDeskPayments() {
  const headers = [
    "Name",
    "Room No.",
    "Room Type",
    "Payment Type",
    "Amount",
    "Check In",
    "Action",
  ];

  const [paymentsRaw, setPaymentsRaw] = useState([]);
  const [chargesRaw, setChargesRaw] = useState([]);
  const [rows, setRows] = useState([]);
  const [range, setRange] = useState("current"); // <-- default to "current"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [toggleCharges, setToggleCharges] = useState({});

  // --- Fetch payments and additional charges ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "payments"), (snapshot) => {
      const allPayments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPaymentsRaw(allPayments.filter((p) => !p.paymentType || p.paymentType !== "Additional Charge"));
      setChargesRaw(allPayments.filter((p) => p.paymentType === "Additional Charge"));
    });

    return () => unsub();
  }, []);

  // --- Filter logic ---
  const getRangeBounds = () => {
    const now = new Date();
    let from = null;
    let to = null;

    switch (range) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
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
      case "all":
      default:
        from = null;
        to = null;
    }
    return { from, to };
  };

  const filterByRange = (payment) => {
    const checkIn = payment.checkIn?.toDate ? payment.checkIn.toDate() : payment.checkIn instanceof Date ? payment.checkIn : null;
    const checkOut = payment.checkOut?.toDate ? payment.checkOut.toDate() : payment.checkOut instanceof Date ? payment.checkOut : null;
    const now = new Date();

    if (range === "current") {
      // Only show payments where now is between checkIn and checkOut
      if (!checkIn || !checkOut) return false;
      return now >= checkIn && now <= checkOut;
    }

    if (!checkIn) return true;
    const { from, to } = getRangeBounds();
    if (!from && !to) return true;
    if (from && to) return checkIn >= from && checkIn <= to;
    if (from && !to) return checkIn >= from;
    if (!from && to) return checkIn <= to;
    return true;
  };

  // --- Build rows with toggle for additional charges ---
  useEffect(() => {
    const filteredPayments = paymentsRaw.filter(filterByRange);

    const tableRows = filteredPayments.map((p) => {
      const pCharges = chargesRaw.filter((c) => c.bookingId === p.bookingId);
      const checkInFormatted = p.checkIn?.toDate ? p.checkIn.toDate().toLocaleDateString() : "-";

      const totalAmount = p.amount + pCharges.reduce((sum, c) => sum + (c.amount || 0), 0);

      return [
        p.name || "Unknown",
        p.roomId || "-",
        p.roomType || "-",
        p.payment || "-",
        `₱ ${totalAmount.toLocaleString()}`,
        checkInFormatted,
        <div key={p.bookingId} className="flex flex-col gap-1">
          <PaymentActions bookingId={p.bookingId} name={p.name} room={p.roomId} />

          {pCharges.length > 0 && (
            <>
              <button
                onClick={() =>
                  setToggleCharges((prev) => ({
                    ...prev,
                    [p.bookingId]: !prev[p.bookingId],
                  }))
                }
                className="text-sm text-blue-600 underline mt-1"
              >
                {toggleCharges[p.bookingId]
                  ? "Hide Additional Charges"
                  : `Show Additional Charges (${pCharges.length})`}
              </button>

              {toggleCharges[p.bookingId] &&
                pCharges.map((c) => (
                  <div key={c.id} className="ml-4 text-sm text-gray-700">
                    {c.description} - ₱ {c.amount}
                  </div>
                ))}
            </>
          )}
        </div>,
      ];
    });

    setRows(tableRows);
  }, [paymentsRaw, chargesRaw, range, customFrom, customTo, toggleCharges]);

  // --- Excel Export ---
  const downloadPaymentsExcel = () => {
    const filteredPayments = paymentsRaw.filter(filterByRange);
    if (!filteredPayments.length) return alert("No records to export");

    const data = filteredPayments.map((p) => {
      const pCharges = chargesRaw.filter((c) => c.bookingId === p.bookingId);
      const totalAmount = p.amount + pCharges.reduce((sum, c) => sum + (c.amount || 0), 0);

      return {
        Name: p.name || "",
        RoomNo: p.roomId || "",
        RoomType: p.roomType || "",
        PaymentType: p.payment || "",
        Amount: totalAmount,
        CheckIn: p.checkIn?.toDate ? p.checkIn.toDate().toLocaleString() : "",
        AdditionalCharges: pCharges.map((c) => `${c.description} ₱ ${c.amount}`).join("; "),
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length, ...data.map((row) => String(row[key] || "").length)) + 2,
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, `payments_${range}.xlsx`);
  };

  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />
      <div className="flex">
        <FrontDeskSidePanel active="Payments" />
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Filter controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Range:</label>
              <select value={range} onChange={(e) => setRange(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="current">Current</option>
                <option value="today">Today</option>
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

            <button
              onClick={downloadPaymentsExcel}
              className="ml-auto px-3 py-1 bg-green-600 text-white rounded-sm text-sm hover:bg-green-700"
            >
              Download Excel
            </button>
          </div>

          <Table headers={headers} rows={rows} />
        </main>
      </div>
    </>
  );
}
