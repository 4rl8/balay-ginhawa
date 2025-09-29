import { useEffect, useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import { db } from "../../config/firebase-config";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

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
    // Gumagawa ng listener sa "roomTypes" collection para makuha details ng bawat room type
    const unsubRoomTypes = onSnapshot(collection(db, "roomTypes"), (snap) => {
      const roomTypesMap = {};
      snap.forEach((docSnap) => {
        roomTypesMap[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
      });

      // Gumagawa ng listener sa "rooms" collection para makuha realtime updates ng lahat ng rooms
      const unsubRooms = onSnapshot(collection(db, "rooms"), (roomSnap) => {
        const rooms = roomSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          const typeData = roomTypesMap[data.roomTypeId] || {};

          // Kung meron nang naka set na price sa room, iyon ang gagamitin, kung wala gagamitin ang basePrice ng room type
          const price =
            data.pricePerNight && data.pricePerNight > 0
              ? data.pricePerNight
              : typeData.basePrice || 0;

          // Kung may checkOut date, i-format ito as readable date, kung wala lagay lang ng dash
          const formattedDate = data.checkOut?.toDate
            ? data.checkOut.toDate().toLocaleDateString()
            : "-";

          // Nagbabalik ng array ng values para sa bawat row ng table
          return [
            data.roomNumber || "N/A",
            typeData.name || data.roomTypeId || "N/A",
            data.status || "inactive",
            data.availability || "vacant",
            `₱ ${price.toLocaleString()}`,
            formattedDate,
            docSnap.id, // Firestore doc ID, ginagamit para ma update ang tamang room
          ];
        });

        // Sine-set ang bagong rows para lumabas sa table
        setRows(rooms);
      });

      // Cleanup ng listener sa rooms
      return () => unsubRooms();
    });

    // Cleanup ng listener sa roomTypes
    return () => unsubRoomTypes();
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
