import { useState } from "react";
import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import bookBG from '../assets/images/bookBG.svg';
import standard from '../assets/images/standardImg.svg';
import twin from '../assets/images/twinImg.svg';
import deluxe from '../assets/images/deluxeImg.svg';
import familySuite from '../assets/images/familySuiteImg.svg';
import pentHouse from '../assets/images/pentHouseImg.svg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../config/firebase-config";
import { collection, getDocs, } from "firebase/firestore";
//tinanggal ko muna addDOc 
  

function isOverlapping(checkIn, checkOut, existingCheckIn, existingCheckOut) {
  return checkIn < existingCheckOut && checkOut > existingCheckIn;
}

const roomTypes = [
  { id: "Standard", label: "Standard", img: standard, price: 3000 },
  { id: "Twin", label: "Twin", img: twin, price: 3000 },
  { id: "Deluxe", label: "Deluxe", img: deluxe, price: 3500 },
  { id: "FamilySuite", label: "Family Suite", img: familySuite, price: 6000 },
  { id: "PentHouse", label: "Penthouse", img: pentHouse, price: 12000 }
];

export function Booking() {
  const [availableByType, setAvailableByType] = useState({});
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    foodPackage: "no",
    payment: ""
  });
  const [activeTypes, setActiveTypes] = useState(roomTypes.map(rt => rt.id));
  const [findClicked, setFindClicked] = useState(false);
  


  async function findAvailableRooms() {
    if (!checkIn || !checkOut) return;
    setFindClicked(true);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const roomsSnap = await getDocs(collection(db, "rooms"));
    const bookingsSnap = await getDocs(collection(db, "bookings"));

    const rooms = roomsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const grouped = {};

    rooms.forEach(room => {
      const booked = bookings.some(b =>
        b.roomId === room.id &&
        isOverlapping(checkInDate, checkOutDate, new Date(b.checkIn), new Date(b.checkOut))
      );

      if (!booked) {
        const roomTypeKey = room.roomTypeId || "Unknown";
        if (!grouped[roomTypeKey]) grouped[roomTypeKey] = [];
        grouped[roomTypeKey].push(room);
      }
    });

    setAvailableByType(grouped);
    setSelectedRoom(null);
    setShowCheckout(false);
  }

  function handleBook(roomTypeId) {
    const freeRooms = availableByType[roomTypeId];
    // Find the room type details for price
    const roomTypeDetails = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomTypeDetails) return;
    setSelectedRoom({
      ...roomTypeDetails,
      ...freeRooms?.[0], // merge Firestore room info if available
      roomTypeId
    });
    setShowCheckout(true);
  }

  function handleGuestInfoChange(e) {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  }

  async function handleCheckout() {

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa("sk_test_ZM26eeASx66vWd8nN6i6wq3y:"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: "Booking Payment",
              quantity: 1,
              amount: 300000, // centavos
              currency: "PHP"
            }
          ],
          payment_method_types: ["gcash", "card", "paymaya"],
          success_url: "http://localhost:5173/success",
          cancel_url: "http://localhost:5173/cancel"
        }
      }
    })
  });

  const result = await response.json();
  console.log(result);

  if (result.data) {
    window.location.href = result.data.attributes.checkout_url;
  } else {
    alert("Error: " + JSON.stringify(result));
  }
}
  //   await addDoc(collection(db, "bookings"), {
  //     roomId: selectedRoom.id,
  //     checkIn,
  //     checkOut,
  //     guests,
  //     guestInfo,
  //     createdAt: new Date()
  //   });
  //   window.location.href = "https://paymongo.com/sandbox/payment";
  // }

  function handleBack() {
    setShowCheckout(false);
    setSelectedRoom(null);
  }

  function handleTypeFilterChange(typeId) {
    setActiveTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  }

  return (
    <>
      <title>Balay Ginhawa</title>
      <div className="relative">
        <img
          src={bookBG}
          alt="balay Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="p-8 text-white px-20 py-8">
          <h1 className="text-4xl font-bold">Book Your Stay</h1>
          <h2 className="text-2xl">Experience comfort and convenience.</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />
      </div>

      {/* Search Bar */}
      {!showCheckout && (
        <div className="flex items-center justify-center mt-8">
          <div className="bg-white border border-gray-300 rounded-md px-10 py-0 flex items-center space-x-4 w-[80%] h-14">
            {/* Check-in */}
            <div className="flex items-center flex-1 h-10 px-4 py-2 rounded border border-gray-300">
              <span className="text-gray-700 font-medium mr-2">Check-in:</span>
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                placeholderText="Select check-in date"
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full text-center"
              />
            </div>
            {/* Check-out */}
            <div className="CheckOut flex items-center flex-1 h-10 px-4 py-2 rounded border border-gray-300">
              <span className="text-gray-700 font-medium mr-2">Check-out:</span>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                placeholderText="Select check-out date"
                minDate={checkIn || new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full text-center"
              />
            </div>
            {/* Guests */}
            <span className="text-gray-700 font-medium">Guests:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="px-4 py-2 rounded border border-gray-300 h-10 w-20"
            />
            {/* Button */}
            <button
              className="border-2 border-blue-500 text-white py-2 px-6 w-full"
              style={{ maxWidth: "200px", backgroundColor: "#82A33D", borderColor: "#82A33D" }}
              onClick={findAvailableRooms}
            >
              FIND
            </button>
          </div>
        </div>
      )}

      {/* Results & Cart Section */}
      <div className="mt-10 mx-[10%] flex flex-col md:flex-row gap-8">
        {/* Rooms Container */}
        {!showCheckout && (
          <div className="w-full md:w-[70%]">
            {roomTypes
              .filter(rt => activeTypes.includes(rt.id))
              .map(rt => (
                <div key={rt.id} className="bg-white rounded-lg shadow-md flex flex-row items-center p-6 mb-8 h-100">
                  {/* Image on the left */}
                  <div className="w-1/2 flex items-center justify-center">
                    <img src={rt.img} alt={rt.label} className="w-full h-80 object-cover " />
                  </div>
                  {/* Details on the right */}
                  <div className="w-1/2 pl-8 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-gray-800">{rt.label} Room</h2>
                      <p className="text-gray-600 mb-2">
                        {rt.label === "Standard" && "A cozy room perfect for solo travelers or couples."}
                        {rt.label === "Twin" && "Ideal for friends or colleagues, with two separate beds."}
                        {rt.label === "Deluxe" && "Extra space and upgraded amenities for comfort."}
                        {rt.label === "Family Suite" && "Spacious suite for families, with multiple beds."}
                        {rt.label === "Penthouse" && "Luxury suite with panoramic views and premium facilities."}
                      </p>
                      <ul className="text-gray-500 mb-2 list-disc pl-5">
                        <li>Free Wi-Fi</li>
                        <li>Air Conditioning</li>
                        <li>Private Bathroom</li>
                        <li>Complimentary Breakfast</li>
                        {rt.label === "Deluxe" && <li>Mini Bar</li>}
                        {rt.label === "Family Suite" && <li>Living Area</li>}
                        {rt.label === "Penthouse" && <li>Panoramic Views</li>}
                        {rt.label === "Penthouse" && <li>Premium Facilities</li>}
                      </ul>
                      <p className="text-lg font-semibold text-blue-600 mb-4">
                        Price: ₱{rt.price}/night
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className={`border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300 ${!findClicked ? "opacity-50 cursor-not-allowed" : ""}`}
                        style={{ backgroundColor: "#82A33D", borderColor: "#82A33D" }}
                        disabled={!findClicked}
                        onClick={() => findClicked && handleBook(rt.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* Filter Container */}
        {!showCheckout && (
          <div className="w-full md:w-[30%]">
            <div className="bg-white border border-gray-300 rounded-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Filter Room Types</h2>
              <div className="flex flex-col gap-2">
                {roomTypes.map(rt => (
                  <label key={rt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeTypes.includes(rt.id)}
                      onChange={() => handleTypeFilterChange(rt.id)}
                      className="accent-blue-500"
                    />
                    <span>{rt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Section (split: fill-up form left, summary right) */}
      {showCheckout && (
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[70%] flex flex-col md:flex-row gap-8">
            {/* Fill-up Form */}
            <div className="w-full md:w-[60%]">
              <button
                className="mb-6 flex items-center text-blue-500 hover:underline"
                onClick={handleBack}
              >
                <span className="mr-2">&#8592;</span> Back to Room Selection
              </button>
              <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                <h2 className="text-2xl font-bold mb-2">Guest Information</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={guestInfo.name}
                  onChange={handleGuestInfoChange}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={guestInfo.email}
                  onChange={handleGuestInfoChange}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={guestInfo.phone}
                  onChange={handleGuestInfoChange}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                {/* Food Package Option */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="font-semibold mb-1">Food Package</label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="foodPackage"
                      value="yes"
                      checked={guestInfo.foodPackage === "yes"}
                      onChange={handleGuestInfoChange}
                      className="accent-blue-500"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="foodPackage"
                      value="no"
                      checked={guestInfo.foodPackage === "no"}
                      onChange={handleGuestInfoChange}
                      className="accent-blue-500"
                    />
                    No
                  </label>
                </div>
              </form>
            </div>
            {/* Checkout Summary */}
            <div className="w-full md:w-[40%]">
              <div className="bg-white border border-gray-300 rounded-md p-8 flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Checkout Summary</h2>
                  {selectedRoom && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedRoom.label} Room</h3>
                      <p className="text-gray-600 mb-2">Room Number: {selectedRoom.roomNumber || "N/A"}</p>
                      <p className="text-gray-600 mb-2">Price: ₱{selectedRoom.price}/night</p>
                      <p className="text-gray-600 mb-2">Tax & Fees: ₱200</p>
                      <p className="text-gray-600 mb-2">Check-in: {checkIn && checkIn.toLocaleDateString()}</p>
                      <p className="text-gray-600 mb-2">Check-out: {checkOut && checkOut.toLocaleDateString()}</p>
                      <p className="text-gray-600 mb-2">Guests: {guests}</p>
                      <p className="text-gray-600 mb-2">Food Package: {guestInfo.foodPackage === "yes" ? "Included" : "Not Included"}</p>
                      <p className="text-lg font-bold text-blue-700 mt-4">
                        Total: ₱{selectedRoom.price + 200}
                      </p>
                    </div>
                  )}
        
                </div>
                <button
                  type="button"
                  className="border-2 border-green-500 bg-green-500 text-white py-2 px-6 w-full rounded hover:bg-green-600 transition duration-300 mt-4"
                  onClick={handleCheckout}
                                style={{ backgroundColor: "#82A33D", borderColor: "#82A33D" }}
                >
                  Checkout & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
