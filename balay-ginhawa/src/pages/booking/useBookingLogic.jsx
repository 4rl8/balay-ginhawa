import { useState } from "react";
import { db } from "../../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";

// Helper function to check if two date ranges overlap
function isOverlapping(checkIn, checkOut, existingCheckIn, existingCheckOut) {
  return checkIn < existingCheckOut && checkOut > existingCheckIn;
}

// Custom hook for booking logic
export function useBookingLogic() {
  // State to store available rooms grouped by type
  const [availableByType, setAvailableByType] = useState({});
  // State to indicate loading status
  const [loading, setLoading] = useState(false);

  // Function to find available rooms based on check-in and check-out dates
  async function findAvailableRooms(checkIn, checkOut) {
    if (!checkIn || !checkOut) return; // Do nothing if dates are not set
    setLoading(true); // Start loading

    // Fetch all rooms and bookings from Firestore
    const roomsSnap = await getDocs(collection(db, "rooms"));
    const bookingsSnap = await getDocs(collection(db, "bookings"));

    // Convert Firestore snapshots to arrays of objects
    const rooms = roomsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Object to group available rooms by their type  
    const grouped = {};

    rooms.forEach(room => {
      const type = room.roomTypeId;
      if (!grouped[type]) grouped[type] = { available: [], booked: [] };
      // Only consider rooms marked as "Available"
      if (!room.availability || room.availability.toLowerCase() !== "available") return;

      // Check if the room is booked for the selected dates
      const booked = bookings.some(b =>
        b.roomId === room.id &&
        isOverlapping(
          new Date(checkIn),
          new Date(checkOut),
          new Date(b.checkIn),
          new Date(b.checkOut)
        )
      );

      // If not booked, add to the grouped result by room type
      if (booked) grouped[type].booked.push(room);
      else grouped[type].available.push(room);

      console.log("Room:", room.id, room.roomTypeId, room.status, room.availability);
    });

    setAvailableByType(grouped); // Update state with available rooms
    setLoading(false); // Stop loading
    return grouped; // Return grouped available rooms (optional)
  }

  // Return state and function for use in components
  return { availableByType, findAvailableRooms, loading };
}
