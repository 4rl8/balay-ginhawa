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
} from "firebase/firestore";

export function FrontDeskBookings() {
  // Table headers
  const headers = ["Guest Name", "Check-in", "Check-out", "Status"];
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      const bookings = querySnap.docs.map((doc) => {
        const data = doc.data();
        const checkIn = data.checkIn?.toDate
          ? data.checkIn.toDate().toLocaleDateString()
          : "N/A";
        const checkOut = data.checkOut?.toDate
          ? data.checkOut.toDate().toLocaleDateString()
          : "N/A";

        // Format ng data para sa Table rows
        return [
          data.guestInfo?.name || "Unknown",
          checkIn,
          checkOut,
          data.status || "Pending",
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
        </main>
      </div>
    </>
  );
}
