
import { useState } from "react";
import { Header } from "../../components/Header";
import divider from "../../assets/images/divider.svg";
import bookBG from "../../assets/images/bookBG.svg";
import standard from "../../assets/images/standard2.png";
import twin from "../../assets/images/twin2.png";
import deluxe from "../../assets/images/deluxe2.png";
import familySuite from "../../assets/images/family2.png";
import pentHouse from "../../assets/images/penthouse2.png";
import { useBookingLogic } from "./useBookingLogic";
import { SearchBar } from "./SearchBar";
import { RoomList } from "./RoomList";
import { RoomFilter } from "./RoomFilter";
import { Checkout } from "./Checkout";
import { Footer } from "@/components/footer";
import ChatBot from "@/components/ChatBot/ChatBot";
import { db } from "../../config/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";



const roomTypes = [
  { id: "Standard", label: "Standard Room", img: standard, price: 3000 },
  { id: "Twin", label: "Twin Room", img: twin, price: 3000 },
  { id: "Deluxe", label: "Deluxe Room", img: deluxe, price: 3500 },
  { id: "FamilySuite", label: "Family Suite", img: familySuite, price: 6000 },
  { id: "PenthouseSuite", label: "Penthouse Suite", img: pentHouse, price: 12000 },
];

const occupancyMap = {
  Standard: "solo",
  Twin: "couple",
  Deluxe: "couple",
  FamilySuite: "family",
  PenthouseSuite: "group",
};


export function Booking() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ Fname: "", LName: "", email: "", phone: "", foodPackage: "no" });
  const [activeTypes, setActiveTypes] = useState(roomTypes.map(rt => rt.id));
  const [findClicked, setFindClicked] = useState(false);
  const [priceSort, setPriceSort] = useState(""); // "low" or "high"
  const [occupancyFilter, setOccupancyFilter] = useState(""); // "solo", "couple", "family", "group"
  const [loading, setLoading] = useState(false);


  let filteredRoomTypes = roomTypes.filter(rt => activeTypes.includes(rt.id));
  if (occupancyFilter) {
    filteredRoomTypes = filteredRoomTypes.filter(rt => occupancyMap[rt.id] === occupancyFilter);
  }
  if (priceSort === "low") {
    filteredRoomTypes = [...filteredRoomTypes].sort((a, b) => a.price - b.price);
  } else if (priceSort === "high") {
    filteredRoomTypes = [...filteredRoomTypes].sort((a, b) => b.price - a.price);
  }


  const { availableByType, findAvailableRooms } = useBookingLogic();

  function handleFind() {
    if (!checkIn || !checkOut) return;
    setFindClicked(true);

    findAvailableRooms(checkIn, checkOut).then(result => {
      // Only include types that have at least one available room
      const availableTypes = Object.keys(result).filter(
        type => result[type].available && result[type].available.length > 0
      );
      setActiveTypes(availableTypes);
    });
  }

  function handleBook(roomTypeId) {
    const details = roomTypes.find(rt => rt.id === roomTypeId);
    const available = availableByType[roomTypeId]?.available[0] || {};
    setSelectedRoom({ ...details, ...available });
    setShowCheckout(true);
  }

      let nights = 1;
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    nights = Math.max(
      1,
      Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24))
    );
  }

  // Safety: ensure selectedRoom has a price
  const roomPrice = selectedRoom?.price || 0;

  // Recalculate total
  const roomTotal = roomPrice * nights;
  const foodPackageFee = guestInfo.foodPackage === "yes" ? 500 * guests : 0;
  const totalPrice = roomTotal + foodPackageFee;

  async function handleCheckout() {
      if (loading) return; // prevent double click
  setLoading(true);



    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${import.meta.env.VITE_PAYMONGO_SECRET_KEY}:`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            line_items: [{
              name: selectedRoom.label,
              quantity: 1,
              amount: totalPrice * 100, // Ensure totalPrice is a valid number
              currency: "PHP"
            }],
            payment_method_types: ["gcash", "card", "paymaya"],
            success_url: "http://localhost:5173/",
            cancel_url: "http://localhost:5173/booking",
          },

        },
      }),
    });

    const result = await response.json();
    const checkout = result.data;

    // Save session to Firestore
   const bookingRef = await addDoc(collection(db, "bookings"), {
      paymentId: checkout.id,
      roomType: selectedRoom.label,
      name: guestInfo.Fname,
      email: guestInfo.email,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      roomId: "",
      foodPackage: guestInfo.foodPackage,
      phone: guestInfo.phone,
      amount: totalPrice,
      status: "paid",
      createdAt: serverTimestamp()
    });


    await addDoc(collection(db, "payments"), {
      bookingId: bookingRef.id,
      paymentId: checkout.id,
      roomType: selectedRoom.label,
      name: guestInfo.Fname,
      email: guestInfo.email,
      checkIn: checkIn,
      checkOut: checkOut,
      foodPackage: guestInfo.foodPackage,
      phone: guestInfo.phone,
      amount: totalPrice,
      status: "paid",
      createdAt: serverTimestamp()
    });



    if (result.data) window.location.href = result.data.attributes.checkout_url;
    else alert("Error: " + JSON.stringify(result));
  }



  function handleClearFilter(roomTypeId) {
    const details = roomTypes.find(rt => rt.id === roomTypeId);
    const available = availableByType[roomTypeId]?.available[0] || {};
    setSelectedRoom({ ...details, ...available });
    setPriceSort(""); // Clear price sort radio
    setOccupancyFilter(""); // Clear occupancy radio
  }

  return (
    <>
      <title>Booking</title>
      <div className="relative">
        <img src={bookBG} alt="bg" className="absolute top-0 left-0 w-full h-60 object-cover -z-10" />
        <Header />
        <div className="ml-10 p-8 text-white px-10 py-8 ml-20">
          <h1 className="text-4xl font-bold">Book Your Stay</h1>
          <h2 className="text-2xl">Experience comfort and convenience.</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />
      </div>

      {!showCheckout && (
        <>
          <SearchBar
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            onFind={handleFind}
          />
          <div className="mt-10 mx-[10%] flex flex-col md:flex-row gap-8">
            <RoomList
              roomTypes={filteredRoomTypes}
              activeTypes={activeTypes}
              findClicked={findClicked}
              onBook={handleBook}
            />
            <RoomFilter
              roomTypes={roomTypes}
              activeTypes={activeTypes}
              onClear={handleClearFilter}
              priceSort={priceSort}
              onSortChange={setPriceSort}
              occupancyFilter={occupancyFilter}
              onOccupancyChange={setOccupancyFilter}
            />
          </div>
        </>
      )}

      {showCheckout && (
        <Checkout
          selectedRoom={selectedRoom}
          guestInfo={guestInfo}
          setGuestInfo={setGuestInfo}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onBack={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
          totalPrice={totalPrice}
          foodPackageFee={foodPackageFee}
            roomTotal={roomTotal}
  nights={nights}
        />
      )}

      <ChatBot />
      <Footer />
    </>
  );
}
