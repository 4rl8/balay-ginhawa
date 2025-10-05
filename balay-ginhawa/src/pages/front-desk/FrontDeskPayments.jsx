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

// Component na ginagamit sa bawat row ng table para sa actions (Add Charges at Checkout)
function PaymentActions({ guest, room, bookingId }) {
  // Local state para kontrolin ang popup at inputs
  const [showPopup, setShowPopup] = useState(false);
  const [chargeDesc, setChargeDesc] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");

  // Function na nagsasave ng bagong additional charge sa Firestore payments collection
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

      // Reset fields at isara ang popup kapag successful
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
      {/* Button para buksan ang popup at mag add ng bagong charge */}
      <button
        onClick={() => setShowPopup(true)}
        className="mt-1 w-full text-sm font-medium underline hover:text-gray-500"
      >
        + Add Charges
      </button>

      {/* Button para sa checkout action ng guest */}
      <button className="w-full px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
        Checkout
      </button>

      {/* Popup na lumalabas kapag nag add ng charge */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-lg p-6 w-[400px] relative">
            {/* Close button para isara ang popup */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Additional Charge</h2>

            {/* Display ng guest at room details */}
            <p className="mb-4">
              <strong>Guest:</strong> {guest} <br />
              <strong>Room:</strong> {room}
            </p>

            {/* Input field para sa description ng charge */}
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

            {/* Input field para sa amount ng charge */}
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

            {/* Save button para i-save ang bagong charge */}
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
  // Headers para sa payments table
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

  // State kung saan ini-store ang lahat ng rows ng payments
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Gumagamit ng realtime listener sa "payments" collection
    const unsubscribe = onSnapshot(collection(db, "payments"), async (snapshot) => {
      const payments = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          let guestName = data.guestName || "Unknown";
          let roomNo = data.roomNo || "-";
          let roomTypeName = "-";

          // Kung may bookingId, kukunin pa ang karagdagang info mula sa bookings at rooms
          if (data.bookingId) {
            const bookingRef = doc(db, "bookings", data.bookingId);
            const bookingSnap = await getDoc(bookingRef);
            if (bookingSnap.exists()) {
              const bookingData = bookingSnap.data();

              // Guest name mula sa booking info kung available
              guestName = bookingData.guestInfo?.name || guestName;

              // Kung may roomId, kukunin ang room details
              if (bookingData.roomId) {
                const roomRef = doc(db, "rooms", bookingData.roomId);
                const roomSnap = await getDoc(roomRef);
                if (roomSnap.exists()) {
                  const roomData = roomSnap.data();
                  roomNo = roomData.roomNumber || roomNo;

                  // Kung may roomTypeId, kukunin din ang room type details
                  if (roomData.roomTypeId) {
                    const typeRef = doc(db, "roomTypes", roomData.roomTypeId);
                    const typeSnap = await getDoc(typeRef);
                    if (typeSnap.exists()) {
                      const typeData = typeSnap.data();
                      roomTypeName = typeData.name || "-";
                    }
                  }
                }
              }
            }
          }

          // Format ng date mula sa Firestore timestamp
          const formattedDate = data.date?.toDate
            ? data.date.toDate().toLocaleDateString()
            : "N/A";

          // Bumabalik ng array na magsisilbing row ng table
          return [
            guestName,
            roomNo,
            roomTypeName,
            data.paymentType || "N/A",
            data.description || "-",
            data.amount ? `₱ ${data.amount}` : "₱ 0.00",
            formattedDate,
            data.bookingId || "-", // ginagamit para sa actions sa dulo
          ];
        })
      );

      // I-set ang rows para lumabas sa table
      setRows(payments);
    });

    // Cleanup ng listener kapag umalis sa component
    return () => unsubscribe();
  }, []);

  // Dinadagdagan ng PaymentActions component ang bawat row
  const rowsWithActions = rows.map((row, i) => [
    ...row.slice(0, 7),
    <PaymentActions key={i} guest={row[0]} room={row[1]} bookingId={row[7]} />,
  ]);

  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />

      <div className="flex">
        {/* Side panel kung saan naka highlight ang Payments */}
        <FrontDeskSidePanel active="Payments" />
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Table component na nagdi display ng headers at rows */}
          <Table headers={headers} rows={rowsWithActions} />
        </main>
      </div>
    </>
  );
}
