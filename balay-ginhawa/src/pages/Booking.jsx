import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import bookBG from '../assets/images/bookBG.svg';
import { CreateRooms } from "../components/Rooms";
import { Cart } from "../components/Cart";
import { Button } from "@/components/button";



export function Booking() {
  return (
    <>
      <title>Balai Ginhawa</title>
      <div className="relative">

        <img
          src={bookBG}
          alt="Balai Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="p-8 text-white px-20 py-8"  >
          <h1 className="text-4xl font-bold">Book Your Stay</h1>
          <h2 className="text-2xl">Experience comfort and convenience.</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />
      </div>

      <div className="flex items-center justify-center mt-8">
        <div className="bg-white border border-gray-300 rounded-md px-10 py-0 flex items-center space-x-4 w-[80%] h-14">
          <span className="text-gray-700 font-medium">Check-in:</span>
          <input
            type="date"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none h-10 flex-1"
            placeholder="Check-in Date"
          />
          <span className="text-gray-700 font-medium">Check-out:</span>
          <input
            type="date"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none h-10 flex-1"
            placeholder="Check-out Date"
          />
          <span className="text-gray-700 font-medium">Guests:</span>
          <input
            type="number"
            min="1"
            max="10"
            defaultValue="1"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none h-10 w-20"
            placeholder="Guests"
          />
          <button
            className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 w-full rounded-none"
            style={{ maxWidth: "200px" }}
          >
            Find
          </button>
        </div>
      </div>


      <div className="flex items mt-8 ml-[15%]" >
        <CreateRooms />
        <Cart />
      </div>

      <Button>Book Now</Button>

    </>
  );
}