import { useState } from "react";
import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import card from '../assets/images/card.png';
import gcash from '../assets/images/gcash.png';
import maya from '../assets/images/maya.png';
import bookBG from '../assets/images/bookBG.svg';
// import standard from '../assets/images/standardImg.png';
// import twin from '../assets/images/twinImg.png';
// import deluxe from '../assets/images/deluxeImg.png';
// import familySuite from '../assets/images/familySuiteImg.png';
// import pentHouse from '../assets/images/pentHouseImg.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../config/firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";


function isOverlapping(checkIn, checkOut, existingCheckIn, existingCheckOut) {
  return checkIn < existingCheckOut && checkOut > existingCheckIn;
}

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
  });

  async function findAvailableRooms() {
    if (!checkIn || !checkOut) return;

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
    if (!freeRooms?.length) return;
    setSelectedRoom({ ...freeRooms[0], roomTypeId });
    setShowCheckout(true);
  }

  function handleGuestInfoChange(e) {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  }

  async function handleCheckout() {
    await addDoc(collection(db, "bookings"), {
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests,
      guestInfo,
      createdAt: new Date()
    });
    window.location.href = "https://paymongo.com/sandbox/payment";
  }

  function handleBack() {
    setShowCheckout(false);
    setSelectedRoom(null);
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
              className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 w-full"
              style={{ maxWidth: "200px" }}
              onClick={findAvailableRooms}
            >
              Find Rooms
            </button>
          </div>
        </div>
      )}

      {/* Results & Cart Section */}
      <div className="mt-10 mx-[10%] flex flex-col md:flex-row gap-8">
        {/* Rooms Container */}
        {!showCheckout && (
          <div className="w-full md:w-[70%]">
            {Object.keys(availableByType).map(roomTypeId => (
              <div key={roomTypeId} className="room-card mb-8">
                <h2 className="text-2xl font-bold">{roomTypeId}</h2>
                <p>{availableByType[roomTypeId].length} available</p>
                <div className="bg-white border border-gray-300 rounded-md w-full p-8 flex mt-4">
                  <div className="w-2/3 flex items-center justify-center">
                    <img
                      src={bookBG}
                      alt="Room"
                      className="w-full h-80 object-cover rounded-md"
                    />
                  </div>
                  <div className="w-2/3 pl-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{roomTypeId} Room</h3>
                      <p className="text-gray-600 mb-2">
                        Enjoy a comfortable stay with modern amenities.
                      </p>
                      <ul className="text-gray-500 mb-2 list-disc pl-5">
                        <li>Free Wi-Fi</li>
                        <li>Air Conditioning</li>
                        <li>Private Bathroom</li>
                        <li>Complimentary Breakfast</li>
                      </ul>
                      <p className="text-lg font-semibold text-blue-600 mb-4">
                        Price: ₱2,500/night
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleBook(roomTypeId)}
                        className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 hover:bg-blue-600 transition duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Section (split: fill-up form left, summary right) */}
        {showCheckout && (
          <div className="w-full flex flex-col md:flex-row gap-8">
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
              </form>
            </div>
            {/* Checkout Summary */}
            <div className="w-full md:w-[40%]">
              <div className="bg-white border border-gray-300 rounded-md p-8 flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Checkout Summary</h2>
                  {selectedRoom && (
                    <div className="mb-6">
                      <img src={bookBG} alt="Room" className="w-full h-40 object-cover rounded-md mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedRoom.roomTypeId} Room</h3>
                      <p className="text-gray-600 mb-2">Room Number: {selectedRoom.roomNumber}</p>
                      <p className="text-gray-600 mb-2">Price: ₱2,500/night</p>
                      <p className="text-gray-600 mb-2">Check-in: {checkIn && checkIn.toLocaleDateString()}</p>
                      <p className="text-gray-600 mb-2">Check-out: {checkOut && checkOut.toLocaleDateString()}</p>
                      <p className="text-gray-600 mb-2">Guests: {guests}</p>
                    </div>
                  )}
                  {/* Payment Options */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: "card", label: "Card", img: card },
                        { value: "gcash", label: "Gcash", img: gcash },
                        { value: "maya", label: "Maya", img: maya }
                      ].map(option => (
                        <div
                          key={option.value}
                          className={`flex items-center justify-between p-2 rounded border transition cursor-pointer ${guestInfo.payment === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                            }`}
                          onClick={() => setGuestInfo({ ...guestInfo, payment: option.value })}
                        >
                          <div className="flex items-center gap-2">
                            <img src={option.img} alt={option.label} className="w-8 h-8" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <input
                            type="radio"
                            name="payment"
                            value={option.value}
                            checked={guestInfo.payment === option.value}
                            onChange={() => setGuestInfo({ ...guestInfo, payment: option.value })}
                            className="accent-blue-500 ml-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="border-2 border-green-500 bg-green-500 text-white py-2 px-6 w-full rounded hover:bg-green-600 transition duration-300 mt-4"
                  onClick={handleCheckout}
                >
                  Checkout & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
