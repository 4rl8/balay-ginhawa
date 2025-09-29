
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function SearchBar({ checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, onFind }) {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="bg-white border border-gray-300 rounded-md px-10 py-0 flex items-center space-x-4 w-[80%] h-14">
        <div className="flex items-center flex-1 h-10 px-4 py-2 rounded border border-gray-300">
          <span className="text-gray-700 font-medium mr-2">Check-in:</span>
          <DatePicker
            selected={checkIn}
            onChange={setCheckIn}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            placeholderText="Select check-in"
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="w-full text-center"
          />
        </div>

        <div className="flex items-center flex-1 h-10 px-4 py-2 rounded border border-gray-300">
          <span className="text-gray-700 font-medium mr-2">Check-out:</span>
          <DatePicker
            selected={checkOut}
            onChange={setCheckOut}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            placeholderText="Select check-out"
            minDate={checkIn || new Date()}
            dateFormat="MMMM d, yyyy"
            className="w-full text-center"
          />
        </div>

        <span className="text-gray-700 font-medium">Guests:</span>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          className="px-4 py-2 rounded border border-gray-300 h-10 w-20"
        />

        <button
          className="border-2 border-green-500 text-white py-2 px-6 w-full"
          style={{ maxWidth: "200px", backgroundColor: "#82A33D", borderColor: "#82A33D" }}
          onClick={onFind}
        >
          FIND
        </button>
      </div>
    </div>
  );
}
