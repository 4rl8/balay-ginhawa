import { useEffect, useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Table from "@/components/Table";
import Popup from "@/components/Popup";
import { db } from "../../config/firebase-config";
import {collection, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, query, where, getDocs,} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Toaster, toast } from "react-hot-toast";

const normalizeRoomType = (type) => {
  if (!type) return "";

  const lower = type.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");

  if (lower.includes("standard")) return "Standard";
  if (lower.includes("deluxe")) return "Deluxe";
  if (lower.includes("twin")) return "Twin";
  if (lower.includes("familysuite") || lower.includes("family")) return "FamilySuite";
  if (lower.includes("penthousesuite") || lower.includes("penthouse")) return "PenthouseSuite";

  return type; // fallback for unexpected names
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  // Firestore timestamp object → JS Date
  if (dateValue.toDate) dateValue = dateValue.toDate();

  // ISO string → JS Date
  if (typeof dateValue === "string") dateValue = new Date(dateValue);

  // Return YYYY-MM-DD (adjusted for local timezone)
  const offset = dateValue.getTimezoneOffset();
  const localDate = new Date(dateValue.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};


export function FrontDeskBookings() {
  // Table headers (keep exactly as you had)
  const headers = ["Guest Name", "Check-in", "Check-out", "Status", "Actions"];

  // raw state and derived rows
  const [rows, setRows] = useState([]);
  const [bookingsRaw, setBookingsRaw] = useState([]);

  // Add/edit UI
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state (used for both Add and Edit)
  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    guests: 1,
    roomId: "", // only id user chooses
    roomType: "", // string name or id from roomTypes
    amount: "",
    payment: "cash",
    checkIn: "",
    checkOut: "",
    foodPackage: "no",
    status: "Unassigned",
    paymentId: "",
  };
  const [form, setForm] = useState(emptyForm);

  // roomTypes and rooms
  const [roomTypes, setRoomTypes] = useState([]); // { id/name, basePrice, ... }
  const [availableRooms, setAvailableRooms] = useState([]); // all available rooms
  const [roomsByType, setRoomsByType] = useState([]); // filtered by selected roomType

  // For date filters
  const [range, setRange] = useState("current"); // default to today
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  
  // load bookings realtime
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bookings"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
      setBookingsRaw(all);
    });
    return () => unsub();
  }, []);

  // load roomTypes once (we assume there's a collection named roomTypes)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "roomTypes"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // If no roomTypes exist, fallback
      const defaultTypes = [
        { name: "Deluxe", basePrice: 4000, description: "", maxGuests: 2 },
        { name: "FamilySuite", basePrice: 6000, description: "", maxGuests: 4 },
        { name: "PenthouseSuite", basePrice: 15000, description: "", maxGuests: 6 },
        { name: "Standard", basePrice: 3000, description: "", maxGuests: 2 },
        { name: "Twin", basePrice: 3500, description: "", maxGuests: 2 },
      ];

      const list = all.length ? all : defaultTypes;

      const normalizedRoomTypes = list.map((r) => ({
        id: r.id || r.name,
        name: r.name || r.id,
        displayName: r.name || r.id,
        normalized: normalizeRoomType(r.name || r.id),
        basePrice: r.basePrice || 0,
      }));

      setRoomTypes(normalizedRoomTypes);
    });

    return () => unsub();
  }, []);


  // load available rooms realtime
  useEffect(() => {
    const q = query(collection(db, "rooms"), where("availability", "in", ["Available", "available"]));
    // Note: Firestore 'in' requires array non-empty; using onSnapshot on collection and filtering client-side is safer for older DBs.
    const unsub = onSnapshot(collection(db, "rooms"), (snap) => {
      const allRooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // keep only those with availability 'Available' (case-insensitive)
      const avail = allRooms.filter((r) => (r.availability || "").toLowerCase() === "available");
      setAvailableRooms(avail);
    });
    return () => unsub();
  }, []);

  // whenever roomType changes in form, update roomsByType
  useEffect(() => {
    if (!form.roomType) {
      setRoomsByType([]);
      return;
    }

    const filtered = availableRooms.filter((r) => {
      const roomTypeVal = normalizeRoomType(r.roomType || r.roomTypeId || "");
      return roomTypeVal.toLowerCase() === normalizeRoomType(form.roomType).toLowerCase();
    });

    setRoomsByType(filtered);


    // set amount to basePrice if roomType exists
    const rtObj = roomTypes.find(
      (rt) =>
        normalizeRoomType(rt.displayName).toLowerCase() === normalizeRoomType(form.roomType).toLowerCase()
    );

    if (rtObj && (!form.amount || form.amount === "")) {
      setForm((prev) => ({ ...prev, amount: rtObj.basePrice || "" }));
    }
  }, [form.roomType, availableRooms, roomTypes]);

  // Helper: converts booking data checkIn/checkOut (timestamp or Date) to yyyy-mm-dd for inputs
  const toDateInputValue = (val) => {
    if (!val) return "";
    try {
      if (val.toDate) {
        // Firestore Timestamp
        const d = val.toDate();
        return d.toISOString().split("T")[0];
      }
      if (val instanceof Date) {
        // JS Date
        return val.toISOString().split("T")[0];
      }
      if (typeof val === "string") {
        // Already stored as string (e.g., "2025-10-15T00:00:00.000Z" or "2025-10-15")
        const d = new Date(val);
        if (!isNaN(d)) return d.toISOString().split("T")[0];
        // if string is already "YYYY-MM-DD"
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
      }
    } catch (err) {
      console.warn("Invalid date value:", val, err);
    }
    return "";
  };

  // compute default bounds & helpers
  const getRangeBounds = (r) => {
    const now = new Date();
    let from = null;
    let to = null;
    switch (r) {
      case "today": {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      }
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
      case "current":
        // "current" doesn't need bounds; handled in filter
        from = null;
        to = null;
        break;
      default:
        from = null;
        to = null;
    }
    return { from, to };
  };

  // use checkIn and checkOut to filter
  const filterBookingByRange = (booking) => {
    const checkIn =
      booking.data.checkIn?.toDate?.() ||
      (booking.data.checkIn instanceof Date ? booking.data.checkIn : null);
    const checkOut =
      booking.data.checkOut?.toDate?.() ||
      (booking.data.checkOut instanceof Date ? booking.data.checkOut : null);

    const today = new Date();

    if (range === "current") {
      if (!checkIn || !checkOut) return false;
      return today >= checkIn && today <= checkOut;
    }

    const { from, to } = getRangeBounds(range);

    // fallback for other ranges
    const d = checkIn || checkOut;
    if (!d) return range === "all" || range === "" || range === "today";
    if (!from && !to) return true;
    if (from && to) return d >= from && d <= to;
    if (from && !to) return d >= from;
    if (!from && to) return d <= to;
    return true;
  };

  // derive rows for table (display normalization only — does not write to Firestore)
  useEffect(() => {
    const rowsBuilt = bookingsRaw.map((b) => {
      const data = b.data;
      const checkIn =
        data.checkIn?.toDate?.().toLocaleDateString() ||
        (data.checkIn instanceof Date ? data.checkIn.toLocaleDateString() : "N/A");
      const checkOut =
        data.checkOut?.toDate?.().toLocaleDateString() ||
        (data.checkOut instanceof Date ? data.checkOut.toLocaleDateString() : "N/A");

      // Normalize display status: do not write to firestore here
      const displayStatus = data.roomId ? "Assigned" : "Unassigned";

      // display name is flat (per your new collection structure)
      return {
        id: b.id,
        display: [data.name || "Unknown", checkIn, checkOut, displayStatus],
        raw: data,
      };
    });

    const filtered = rowsBuilt.filter((r, i) => filterBookingByRange(bookingsRaw[i]));
    const tableRows = filtered.map((r) => [
      ...r.display,
      <button
        key={`edit-${r.id}`}
        onClick={() => openEditForId(r.id, r.raw)}
        className="px-2 py-1 bg-gray-200 rounded-md text-xs hover:bg-gray-300 inline-block"
      >
        Edit
      </button>,
    ]);
    setRows(tableRows);
  }, [bookingsRaw, range, customFrom, customTo]);

  // ===== Excel export (kept same) =====
  const downloadBookingsExcel = () => {
    const filtered = bookingsRaw.filter(filterBookingByRange);
    if (!filtered.length) {
      toast.error("No records to download for the selected range.");
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
        Name: d.name || "",
        Email: d.email || "",
        Phone: d.phone || "",
        Guests: d.guests || "",
        RoomType: d.roomType || "",
        RoomID: d.roomId || "",
        Amount: d.amount || "",
        CheckIn: checkIn,
        CheckOut: checkOut,
        Status: d.status || "",
        CreatedAt: createdAt,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-adjust column widths
    const objectMaxLength = [];
    const keys = Object.keys(data[0] || {});
    keys.forEach((key, i) => {
      const columnLengths = data.map((row) => (row[key] ? row[key].toString().length : 0));
      const headerLength = key.length;
      const maxLength = Math.max(headerLength, ...columnLengths);
      objectMaxLength[i] = maxLength;
    });
    worksheet["!cols"] = objectMaxLength.map((len) => ({ wch: len + 2 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `bookings_${range || "all"}.xlsx`);
  };

  // ===== Add flow =====
  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm((prev) => ({ ...emptyForm }));
    setShowModal(true);
  };

  // helper to generate a random-ish paymentId (you can replace with your own generator)
  const genPaymentId = () => {
    return "cs_" + Math.random().toString(36).slice(2, 12);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure all fields are present
      const bookingData = {
        name: form.name || "",
        email: form.email || "",
        phone: form.phone || "",
        guests: form.guests ? Number(form.guests) : 1,
        roomId: form.roomId || "",       // <--- always include, even if empty
        roomType: form.roomType || "",
        amount: Number(form.amount || 0),
        payment: form.payment || "cash",
        foodPackage: form.foodPackage || "no",
        checkIn: form.checkIn ? new Date(form.checkIn) : null,
        checkOut: form.checkOut ? new Date(form.checkOut) : null,
        status: form.roomId ? "Assigned" : "Unassigned",
        paymentId: "",                   // placeholder
        createdAt: serverTimestamp(),
      };

      // Add booking first
      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);

      // Then create the payment record
      const paymentData = {
        bookingId: bookingRef.id,
        paymentId: "",   // placeholder, will update below
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        guests: bookingData.guests,
        roomId: bookingData.roomId,
        roomType: bookingData.roomType,
        amount: bookingData.amount,
        payment: bookingData.payment,
        foodPackage: bookingData.foodPackage,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        status: "paid",
        createdAt: serverTimestamp(),
      };

      const paymentRef = await addDoc(collection(db, "payments"), paymentData);

      // Now update both sides so booking has paymentId and payment has it too
      await updateDoc(paymentRef, { paymentId: paymentRef.id });
      await updateDoc(bookingRef, { paymentId: paymentRef.id });

      console.log("Booking and Payment linked successfully!");
      setShowModal(false);
      setForm(emptyForm);
    } catch (err) {
      console.error("Error adding booking:", err);
    }
  };

  // ===== Edit flow =====
  // open edit modal and populate form with booking fields
  const openEditForId = (id, data) => {
    setIsEditing(true);
    setEditingId(id);

    // Normalize and format
    const normalizedRoomType = normalizeRoomType(data.roomType);
    const checkInValue = formatDateForInput(data.checkIn);
    const checkOutValue = formatDateForInput(data.checkOut);

    // Always recalculate correct total, regardless of source
    const recalculatedAmount = calculateTotalAmount(
      normalizedRoomType,
      data.foodPackage || "no",
      checkInValue,
      checkOutValue
    );

    setForm({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      guests: data.guests || 1,
      roomId: data.roomId || "",
      roomType: normalizedRoomType || "",
      amount: recalculatedAmount || data.amount || 0,
      payment: data.payment || "cash",
      checkIn: checkInValue,
      checkOut: checkOutValue,
      foodPackage: data.foodPackage || "no",
      status: data.status || (data.roomId ? "Assigned" : "Unassigned"),
      paymentId: data.paymentId || "",
    });

    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const prevBooking = bookingsRaw.find((b) => b.id === editingId);
    const prevRoomId = prevBooking?.data?.roomId || "";

    // Always recalc latest total before save
    const finalAmount = calculateTotalAmount(
      form.roomType,
      form.foodPackage,
      form.checkIn,
      form.checkOut
    );

    const updated = {
      name: form.name || "",
      email: form.email || "",
      phone: form.phone || "",
      guests: Number(form.guests || 1),
      roomId: form.roomId || "",
      roomType: form.roomType || "",
      amount: Number(finalAmount || 0),
      payment: form.payment || "cash",
      checkIn: new Date(form.checkIn),
      checkOut: new Date(form.checkOut),
      foodPackage: form.foodPackage || "no",
      status: form.roomId ? "Assigned" : "Unassigned",
      paymentId: form.paymentId || "",
    };

    try {
      //Update bookings document
      await updateDoc(doc(db, "bookings", editingId), updated);

      //Update matching payments document(s)
      if (updated.paymentId) {
        const q = query(
          collection(db, "payments"),
          where("paymentId", "==", updated.paymentId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          for (const pdoc of snap.docs) {
            await updateDoc(doc(db, "payments", pdoc.id), updated);
          }
        }
      }

        // Room availability adjustments
        if (prevRoomId && prevRoomId !== updated.roomId) {
          await updateDoc(doc(db, "rooms", prevRoomId), { availability: "Available" });
        }
        if (updated.roomId && prevRoomId !== updated.roomId) {
          await updateDoc(doc(db, "rooms", updated.roomId), { availability: "Booked" });
        }

        setShowEditModal(false);
        setEditingId(null);
        setIsEditing(false);
        setForm(emptyForm);
      } catch (err) {
        console.error("Error updating booking & payment:", err);
        toast.error("Update failed - check console");
      }
    };

const handleDelete = async (id) => {
  if (!id) return;

  // Custom centered confirmation toast that stays until dismissed
  toast.custom(
    (t) => (
      <div
        className={`bg-white shadow-lg rounded-lg p-4 mt-100 flex flex-col gap-2 text-center w-[300px] transition-all ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <p className="font-medium text-gray-800">Are you sure you want to delete this booking?</p>
        <div className="flex gap-3 justify-center mt-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(t.id); // close the confirmation toast immediately

              try {
                // Get the booking first (to find related payment if any)
                const booking = bookingsRaw.find((b) => b.id === id);
                const paymentId = booking?.data?.paymentId;

                // Delete booking document
                await deleteDoc(doc(db, "bookings", id));

                // Optionally delete matching payment
                if (paymentId) {
                  const q = query(collection(db, "payments"), where("paymentId", "==", paymentId));
                  const snap = await getDocs(q);
                  for (const docSnap of snap.docs) {
                    await deleteDoc(doc(db, "payments", docSnap.id));
                  }
                }

                // Update UI immediately
                setBookingsRaw((prev) => prev.filter((b) => b.id !== id));

                // Close modal and reset edit states
                setShowEditModal(false);
                setIsEditing(false);
                setEditingId(null);

                toast.success("Booking deleted successfully!");
              } catch (error) {
                console.error("Error deleting booking:", error);
                toast.error("Failed to delete booking.");
              }
            }}
          >
            Yes
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      id: "delete-confirm-toast",
      duration: Infinity,
      position: "top-center",
    }
  );
};


  const calculateTotalAmount = (roomType, foodPackage, checkIn, checkOut) => {
  if (!roomType || !checkIn || !checkOut) return 0;

  // Find the base price for selected room
  const selectedRoom = roomTypes.find(
    (r) => normalizeRoomType(r.name || r.id) === normalizeRoomType(roomType)
  );
  const basePrice = selectedRoom?.basePrice || 0;

  // Calculate number of nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(
    1,
    Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  );

  // Food package (₱500 per night)
  const foodCostPerNight = foodPackage === "yes" ? 500 : 0;

  // Total
  return (basePrice + foodCostPerNight) * nights;
};


  // Update form on input change
const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => {
    const updated = { ...prev, [name]: value };

    // Recalculate total whenever these change
    if (["roomType", "checkIn", "checkOut", "foodPackage"].includes(name)) {
      updated.amount = calculateTotalAmount(
        updated.roomType,
        updated.foodPackage,
        updated.checkIn,
        updated.checkOut
      );
    }

    return updated;
  });
};

  // When roomType dropdown changes we already update roomsByType via effect.
  // But make sure amount uses basePrice if present
const handleRoomTypeChange = (selectedType) => {
  setForm((prev) => {
    const updated = { ...prev, roomType: selectedType };
    updated.amount = calculateTotalAmount(
      selectedType,
      prev.foodPackage,
      prev.checkIn,
      prev.checkOut
    );
    return updated;
  });
};

  // Render
  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />
                <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex">
        <FrontDeskSidePanel active="Bookings" />

        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={openAddModal}
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

          {/* Add Booking popup */}
          <Popup isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-lg font-bold mb-4">Add Booking</h2>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Guest Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" required />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Guests</label>
                <input type="number" name="guests" value={form.guests} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" min="1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Room Type</label>
                <select name="roomType" value={form.roomType} onChange={(e) => handleRoomTypeChange(e.target.value)}
                  className="w-full border rounded px-2 py-1">
                  <option value="">Select room type (optional)</option>
                  {roomTypes.map((rt) => (
                    <option key={rt.name || rt.id} value={rt.name || rt.id}>
                      {rt.name || rt.id} {rt.basePrice ? ` — ₱ ${rt.basePrice}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Room ID</label>
                <select name="roomId" value={form.roomId} onChange={handleChange}
                  className="w-full border rounded px-2 py-1">
                  <option value="">No room assigned</option>
                  {roomsByType.map((r) => (
                    <option key={r.roomNumber || r.id} value={r.id || r.roomNumber}>
                      {r.roomNumber || r.id} {r.pricePerNight ? ` — ₱ ${r.pricePerNight}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Food Package</label>
                <select name="foodPackage" value={form.foodPackage} onChange={handleChange}
                  className="w-full border rounded px-2 py-1">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Payment Method</label>
                <select name="payment" value={form.payment} onChange={handleChange}
                  className="w-full border rounded px-2 py-1">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Check-In Date</label>
                <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" required />
              </div>

              <div>
                <label className="block text-sm font-medium">Check-Out Date</label>
                <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" required />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </Popup>


            {/* Edit Booking popup */}
            <Popup isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
              <h2 className="text-lg font-bold mb-4">Edit Booking</h2>
              <form onSubmit={handleEditSubmit} className="space-y-3">
                {/* Guest Info */}
                <div>
                  <label className="block text-sm font-medium">Guest Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    min="1"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium">Room Type</label>
                  <select
                    name="roomType"
                    value={normalizeRoomType(form.roomType)}
                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select room type (optional)</option>
                    {roomTypes.map((rt) => (
                      <option key={rt.name || rt.id} value={normalizeRoomType(rt.name || rt.id)}>
                        {rt.name || rt.id} {rt.basePrice ? `— ₱ ${rt.basePrice}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room ID */}
                <div>
                  <label className="block text-sm font-medium">Room ID</label>
                  <select
                    name="roomId"
                    value={form.roomId}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">No room assigned</option>
                    {form.roomId &&
                      !roomsByType.some((r) => (r.id || r.roomNumber) === form.roomId) && (
                        <option value={form.roomId}>{form.roomId} (current)</option>
                      )}
                    {roomsByType.map((r) => (
                      <option key={r.roomNumber || r.id} value={r.id || r.roomNumber}>
                        {r.roomNumber || r.id}{" "}
                        {r.pricePerNight ? ` — ₱ ${r.pricePerNight}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Food Package</label>
                  <select
                    name="foodPackage"
                    value={form.foodPackage}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Assigned">Assigned</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Check-In Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Check-Out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                {/* Buttons */}
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

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingId)}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </Popup>
        </main>
      </div>
    </>
  );
}