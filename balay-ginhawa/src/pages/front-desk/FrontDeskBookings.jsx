import { useEffect, useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";
import Popup from "@/components/Popup";
import { db } from "../../config/firebase-config";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function FrontDeskBookings() {
  // Table headers
  const headers = ["Guest Name", "Check-in", "Check-out", "Status", "Actions"];
  const [rows, setRows] = useState([]);
  const [bookingsRaw, setBookingsRaw] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDocId, setEditDocId] = useState(null);
  const [editData, setEditData] = useState({});
  const [originalTypes, setOriginalTypes] = useState({});

  // State para sa booking form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    roomId: "",
    payment: "cash",
    checkIn: "",
    checkOut: "",
  });

  // Real-time listener para sa bookings collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bookings"), (querySnap) => {
      const all = querySnap.docs.map((docSnap) => ({
        id: docSnap.id,
        data: docSnap.data(),
      }));
      setBookingsRaw(all);
    });

    // Cleanup function para hindi mag memory leak
    return () => unsub();
  }, []);

  // Date filter state
  const [range, setRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

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

  const filterBookingByRange = (booking) => {
    const d =
      booking.data.checkIn?.toDate?.() ||
      (booking.data.checkIn instanceof Date ? booking.data.checkIn : null) ||
      booking.data.checkOut?.toDate?.() ||
      (booking.data.checkOut instanceof Date ? booking.data.checkOut : null);
    if (!d) return range === "all" || range === "";
    const { from, to } = getRangeBounds(range);
    if (!from && !to) return true; // all time
    if (from && to) return d >= from && d <= to;
    if (from && !to) return d >= from;
    if (!from && to) return d <= to;
    return true;
  };

  // derive rows from bookingsRaw and current filter
  useEffect(() => {
    const rowsBuilt = bookingsRaw.map((b) => {
      const data = b.data;
      const checkIn =
        data.checkIn?.toDate?.().toLocaleDateString() ||
        (data.checkIn instanceof Date
          ? data.checkIn.toLocaleDateString()
          : "N/A");
      const checkOut =
        data.checkOut?.toDate?.().toLocaleDateString() ||
        (data.checkOut instanceof Date
          ? data.checkOut.toLocaleDateString()
          : "N/A");
      return {
        id: b.id,
        display: [
          data.guestInfo?.name || "Unknown",
          checkIn,
          checkOut,
          data.status || "Pending",
        ],
        raw: data,
      };
    });

    const filtered = rowsBuilt.filter((r, i) =>
      filterBookingByRange(bookingsRaw[i])
    );

    const tableRows = filtered.map((r) => [
      ...r.display,
      <button
        key={`edit-${r.id}`}
        onClick={() => openEditModal(r.id, r.raw)}
        className="px-2 py-1 bg-gray-200 rounded-md text-xs hover:bg-gray-300 inline-block"
      >
        Edit
      </button>,
    ]);
    setRows(tableRows);
  }, [bookingsRaw, range, customFrom, customTo]);

// Download bookings as Excel using SheetJS
const downloadBookingsExcel = () => {
  const filtered = bookingsRaw.filter(filterBookingByRange);
  if (!filtered.length) {
    alert("No records to download for the selected range.");
    return;
  }

  const data = filtered.map((b) => {
    const d = b.data;
    const checkIn =
      d.checkIn?.toDate?.().toISOString() ||
      (d.checkIn instanceof Date ? d.checkIn.toISOString() : "");
    const checkOut =
      d.checkOut?.toDate?.().toISOString() ||
      (d.checkOut instanceof Date ? d.checkOut.toISOString() : "");
    const createdAt =
      d.createdAt?.toDate?.().toISOString() ||
      (d.createdAt instanceof Date ? d.createdAt.toISOString() : "");
    return {
      ID: b.id,
      GuestName: d.guestInfo?.name || "",
      Email: d.guestInfo?.email || "",
      Phone: d.guestInfo?.phone || "",
      Guests: d.guests || "",
      RoomID: d.roomId || "",
      Payment: d.payment || "",
      CheckIn: checkIn,
      CheckOut: checkOut,
      Status: d.status || "",
      CreatedAt: createdAt,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // === Auto-adjust column widths ===
  const objectMaxLength = [];
  const keys = Object.keys(data[0]);
  keys.forEach((key, i) => {
    const columnLengths = data.map((row) =>
      row[key] ? row[key].toString().length : 0
    );
    const headerLength = key.length;
    const maxLength = Math.max(headerLength, ...columnLengths);
    objectMaxLength[i] = maxLength;
  });
  worksheet["!cols"] = objectMaxLength.map((len) => ({ wch: len + 2 }));

  // Create workbook and export
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `bookings_${range || "all"}.xlsx`);
};


  // Update form state kapag may pagbabago sa inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal and prepare flattened editable data
  const openEditModal = (id, dataObj) => {
    const flat = {};
    const types = {};

    const recurse = (obj, prefix = "") => {
      Object.keys(obj || {}).forEach((key) => {
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (val && typeof val.toDate === "function") {
          const iso = val.toDate().toISOString().slice(0, 10);
          flat[path] = iso;
          types[path] = "timestamp";
        } else if (val instanceof Date) {
          flat[path] = val.toISOString().slice(0, 10);
          types[path] = "date";
        } else if (val && typeof val === "object" && !Array.isArray(val)) {
          recurse(val, path);
        } else {
          flat[path] = val;
          types[path] = typeof val;
        }
      });
    };

    recurse(dataObj);
    setEditDocId(id);
    setEditData(flat);
    setOriginalTypes(types);
    setShowEditModal(true);
  };

  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const unflatten = (flatObj) => {
    const out = {};
    Object.keys(flatObj).forEach((path) => {
      const parts = path.split(".");
      let cur = out;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === parts.length - 1) {
          const type = originalTypes[path];
          let val = flatObj[path];
          if (type === "timestamp" || type === "date") {
            val = val ? new Date(val) : null;
          } else if (type === "number") {
            val = val === "" || val === null ? null : Number(val);
          }
          cur[p] = val;
        } else {
          cur[p] = cur[p] || {};
          cur = cur[p];
        }
      }
    });
    return out;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editDocId) return;
    const updated = unflatten(editData);
    try {
      await updateDoc(doc(db, "bookings", editDocId), updated);
      setShowEditModal(false);
      setEditDocId(null);
      setEditData({});
      setOriginalTypes({});
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  // Add booking sa Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), {
        guestInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        guests: Number(form.guests),
        roomId: form.roomId,
        payment: form.payment,
        checkIn: new Date(form.checkIn),
        checkOut: new Date(form.checkOut),
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      setShowModal(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: 1,
        roomId: "",
        payment: "cash",
        checkIn: "",
        checkOut: "",
      });
    } catch (err) {
      console.error("Error adding booking:", err);
    }
  };

  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />

      <div className="flex">
        <FrontDeskSidePanel active="Bookings" />

        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-gray-300 text-black rounded-sm"
            >
              Add Booking
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm">Range:</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All time</option>
                <option value="week">Last 7 days</option>
                <option value="month">This month</option>
                <option value="6months">Last 6 months</option>
                <option value="year">Last year</option>
                <option value="custom">Custom</option>
              </select>
              {range === "custom" && (
                <>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </>
              )}
            </div>

            <button
              onClick={downloadBookingsExcel}
              className="ml-auto px-3 py-1 bg-green-600 text-white rounded-sm text-sm hover:bg-green-700"
            >
              Download Excel
            </button>
          </div>

          <Table headers={headers} rows={rows} />

          {/* Popup for Add Booking */}
          <Popup isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-lg font-bold mb-4">Add Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Guest Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                name="guests"
                placeholder="Guests"
                value={form.guests}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                min="1"
              />
              <input
                type="text"
                name="roomId"
                placeholder="Room ID (e.g. R001)"
                value={form.roomId}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </Popup>

          {/* Edit modal */}
          <Popup isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
            <h2 className="text-lg font-bold mb-4">Edit Booking</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              {Object.keys(editData).length === 0 && (
                <div className="text-gray-500">No editable fields</div>
              )}

              {Object.entries(editData).map(([key, value]) => {
                const inputType =
                  originalTypes[key] === "timestamp" ||
                  originalTypes[key] === "date"
                    ? "date"
                    : typeof value === "number"
                    ? "number"
                    : "text";
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-sm text-gray-600">{key}</label>
                    <input
                      type={inputType}
                      value={value ?? ""}
                      onChange={(e) => handleEditChange(key, e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </Popup>
        </main>
      </div>
    </>
  );
}
