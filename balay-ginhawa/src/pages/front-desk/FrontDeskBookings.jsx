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

export function FrontDeskBookings() {
  // Table headers
  const headers = ["Guest Name", "Check-in", "Check-out", "Status", "Actions"];
  const [rows, setRows] = useState([]);
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
      const bookings = querySnap.docs.map((docSnap) => {
        const data = docSnap.data();
        const checkIn = data.checkIn?.toDate
          ? data.checkIn.toDate().toLocaleDateString()
          : "N/A";
        const checkOut = data.checkOut?.toDate
          ? data.checkOut.toDate().toLocaleDateString()
          : "N/A";

        // Return row as array; append Edit button as last cell
        return [
          data.guestInfo?.name || "Unknown",
          checkIn,
          checkOut,
          data.status || "Pending",
          // Actions cell: a React element (Edit button) that opens edit modal
          (
            <button
              onClick={() => openEditModal(docSnap.id, data)}
              className="px-4 py-2 bg-gray-200 rounded-md text-s hover:bg-gray-300 inline-block"
            >
              Edit
            </button>
          ),
        ];
      });
      setRows(bookings);
    });

    // Cleanup function para hindi mag memory leak
    return () => unsub();
  }, []);

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

        // Firestore Timestamp
        if (val && typeof val.toDate === "function") {
          const iso = val.toDate().toISOString().slice(0, 10); // yyyy-mm-dd
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
            // convert back to Date object; updateDoc accepts Date
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

      // Reset fields at close modal pagkatapos mag save
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
      {/* Header para sa front desk pages */}
      <FrontDeskHeader />

      <div className="flex">
        {/* Side panel with active Bookings */}
        <FrontDeskSidePanel active="Bookings" />

        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Button pang open ng Add Booking modal */}
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-gray-300 text-black rounded-sm"
          >
            Add Booking
          </button>

          {/* Table component na may dynamic rows */}
          <Table headers={headers} rows={rows} />

          {/* Popup modal para sa Add Booking form */}
          <Popup isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-lg font-bold mb-4">Add Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input fields para sa guest details */}
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

              {/* Action buttons para sa form */}
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

          {/* Edit modal - renders dynamic fields based on editData */}
          <Popup isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
            <h2 className="text-lg font-bold mb-4">Edit Booking</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              {/* Render inputs for each flattened key */}
              {Object.keys(editData).length === 0 && (
                <div className="text-gray-500">No editable fields</div>
              )}

              {Object.entries(editData).map(([key, value]) => {
                const inputType = originalTypes[key] === "timestamp" || originalTypes[key] === "date" ? "date" : typeof value === "number" ? "number" : "text";
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
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </Popup>
        </main>
      </div>
    </>
  );
}
