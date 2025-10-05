import { useEffect, useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import { db } from "../../config/firebase-config";
import { collection, onSnapshot, updateDoc, doc, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export function FrontDeskRooms() {
  // Ito yung mga header ng table, fixed values na ipapakita sa taas ng bawat column
  const headers = [
    "Room No.",
    "Type",
    "Status",
    "Availability",
    "Price / Night",
    "Check Out Date",
    "Change Availability",
  ];

  // State para sa rows ng table, naglalaman ng data ng bawat room
  const [rows, setRows] = useState([]);
  useEffect(() => {
    // We'll subscribe to roomTypes, rooms, and bookings and rebuild rows whenever any change.
    let latestRoomTypes = {};
    let latestRoomsDocs = [];
    let latestBookingsMap = {}; // roomId (string) -> latest checkOut (Date or Timestamp)

    const unsubRoomTypes = onSnapshot(collection(db, "roomTypes"), (snap) => {
      const map = {};
      snap.forEach((d) => (map[d.id] = { id: d.id, ...d.data() }));
      latestRoomTypes = map;
      rebuildRows();
    });

    const unsubRooms = onSnapshot(collection(db, "rooms"), (snap) => {
      latestRoomsDocs = snap.docs;
      rebuildRows();
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        const rid = data.roomId;
        const co = data.checkOut;
        // Normalize to Date for easy comparison
        let date = null;
        if (co?.toDate) date = co.toDate();
        else if (co instanceof Date) date = co;

        if (!rid || !date) return;

        // Keep the latest (max) checkOut per roomId
        if (!map[rid] || map[rid] < date) map[rid] = date;
      });
      latestBookingsMap = map;
      rebuildRows();
    });

    function rebuildRows() {
      if (!latestRoomsDocs) return;
      const rowsBuilt = latestRoomsDocs.map((docSnap) => {
        const data = docSnap.data();
        const typeData = latestRoomTypes[data.roomTypeId] || {};

        const price = data.pricePerNight && data.pricePerNight > 0 ? data.pricePerNight : typeData.basePrice || 0;

        // Try bookings map by doc id first, then by roomNumber
        let formattedDate = "-";
        const byDoc = latestBookingsMap[docSnap.id];
        const byNumber = data.roomNumber ? latestBookingsMap[data.roomNumber] : null;
        const useDate = byDoc || byNumber || null;
        if (useDate) {
          formattedDate = useDate.toLocaleDateString();
        }

        return [
          data.roomNumber || "N/A",
          typeData.name || data.roomTypeId || "N/A",
          data.status || "inactive",
          data.availability || "vacant",
          `₱ ${price.toLocaleString()}`,
          formattedDate,
          docSnap.id,
        ];
      });

      setRows(rowsBuilt);
    }

    return () => {
      unsubRoomTypes();
      unsubRooms();
      unsubBookings();
    };
  }, []);

  // Function na ginagamit kapag may pinili sa dropdown para baguhin ang availability ng room
  const handleAvailabilityChange = async (rowIndex, newAvailability) => {
    const roomId = rows[rowIndex][6]; // Kinukuha yung Firestore doc ID ng tamang room
    try {
      // Ina-update ang availability field ng specific room sa Firestore
      await updateDoc(doc(db, "rooms", roomId), {
        availability: newAvailability,
      });

      // Ina-update din local state para agad mag reflect sa UI nang hindi nag re reload
      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === rowIndex ? [...row.slice(0, 3), newAvailability, ...row.slice(4)] : row
        )
      );
    } catch (err) {
      console.error("Error updating room availability:", err);
    }
  };

  // Dinadagdagan ang bawat row ng dropdown component sa dulo ng row
  const rowsWithDropdown = rows.map((row, i) => [
    ...row.slice(0, 6), // Lahat ng fields maliban sa doc ID
    <Dropdown
      key={i}
      roomNo={row[0]}
      onSelect={(value) => handleAvailabilityChange(i, value)}
    />,
  ]);

  return (
    <>
      <title>balay Ginhawa</title>

      {/* Header component para sa front desk UI */}
      <FrontDeskHeader />

      <div className="flex">
        {/* Side panel component, naka highlight ang "Rooms" */}
        <FrontDeskSidePanel active="Rooms" />
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Table component kung saan pinapasa ang headers at rows */}
          <Table headers={headers} rows={rowsWithDropdown} />
        </main>
      </div>
    </>
  );
}
