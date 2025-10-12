import { useEffect, useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import { db } from "../../config/firebase-config";
import {collection, onSnapshot, updateDoc, doc,} from "firebase/firestore";

export function FrontDeskRooms() {
  const headers = [
    "Room No.",
    "Type",
    "Status",
    "Availability",
    "Price / Night",
    "Check Out Date",
    "Change Availability",
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    let latestRoomTypes = {};
    let latestRoomsDocs = [];
    let latestBookingsMap = {};

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
        let date = null;
        if (co?.toDate) date = co.toDate();
        else if (co instanceof Date) date = co;
        if (!rid || !date) return;

        // Keep only the latest checkout per room
        if (!map[rid] || map[rid] < date) map[rid] = date;
      });
      latestBookingsMap = map;
      rebuildRows();
    });

    async function rebuildRows() {
      if (!latestRoomsDocs) return;
      const now = new Date();

      const rowsBuilt = await Promise.all(
        latestRoomsDocs.map(async (docSnap) => {
          const data = docSnap.data();
          const typeData = latestRoomTypes[data.roomTypeId] || {};
          const price =
            data.pricePerNight && data.pricePerNight > 0
              ? data.pricePerNight
              : typeData.basePrice || 0;

          // Get latest check-out date
          const byDoc = latestBookingsMap[docSnap.id];
          const byNumber = data.roomNumber
            ? latestBookingsMap[data.roomNumber]
            : null;
          const latestCheckOut = byDoc || byNumber || null;

          let formattedDate = "-";
          if (latestCheckOut) {
            formattedDate = latestCheckOut.toLocaleDateString();
          }

          let newAvailability = data.availability || "Available";
          let newStatus = data.status || "inactive";

          // If check-out has passed → mark as "For Cleaning" & inactive
          if (latestCheckOut && latestCheckOut < now) {
            if (data.availability !== "For Cleaning") {
              newAvailability = "For Cleaning";
              newStatus = "inactive";

              try {
                await updateDoc(doc(db, "rooms", docSnap.id), {
                  availability: newAvailability,
                  status: newStatus,
                });
              } catch (err) {
                console.error("Error auto-updating room:", err);
              }
            }
          }

          return [
            data.roomNumber || "N/A",
            typeData.name || data.roomTypeId || "N/A",
            newStatus,
            newAvailability,
            `₱ ${price.toLocaleString()}`,
            formattedDate,
            docSnap.id,
          ];
        })
      );

      setRows(rowsBuilt);
    }

    return () => {
      unsubRoomTypes();
      unsubRooms();
      unsubBookings();
    };
  }, []);

  const handleAvailabilityChange = async (rowIndex, newAvailability) => {
    const roomId = rows[rowIndex][6];
    let newStatus = "active";

    // If set to Maintenance or For Cleaning → inactive
    if (
      newAvailability === "Maintenance" ||
      newAvailability === "For Cleaning"
    ) {
      newStatus = "inactive";
    }

    try {
      await updateDoc(doc(db, "rooms", roomId), {
        availability: newAvailability,
        status: newStatus,
      });

      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === rowIndex
            ? [
                row[0],
                row[1],
                newStatus,
                newAvailability,
                row[4],
                row[5],
                row[6],
              ]
            : row
        )
      );
    } catch (err) {
      console.error("Error updating room availability:", err);
    }
  };

  const rowsWithDropdown = rows.map((row, i) => [
    ...row.slice(0, 6),
    <Dropdown
      key={i}
      roomNo={row[0]}
      onSelect={(value) => handleAvailabilityChange(i, value)}
    />,
  ]);

  return (
    <>
      <title>balay Ginhawa</title>
      <FrontDeskHeader />
      <div className="flex">
        <FrontDeskSidePanel active="Rooms" />
        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          <Table headers={headers} rows={rowsWithDropdown} />
        </main>
      </div>
    </>
  );
}
