
export function RoomCard({ roomType, findClicked, onBook }) {
  const { id, label, img, price } = roomType;
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-row items-center p-6 mb-8">
      <div className="w-1/2 flex items-center justify-center">
        <img src={img} alt={label} className="w-full h-80 object-cover" />
      </div>
      
      <div className="w-1/2 pl-8 flex flex-col justify-between ">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{label}</h2>
          <ul className="text-gray-500 mb-2 list-disc pl-5">
            <li>Free Wi-Fi</li><li>Air Conditioning</li><li>Private Bathroom</li>
          </ul>
          <p className="text-xl font-semibold text-black-800 mb-4">₱{price}/night</p>
        </div>
        <button
          className={`border-2 text-white py-2 px-6 rounded w-1/2 ml-auto transition duration-300 ${!findClicked ? "opacity-50" : ""}`}
          style={{ backgroundColor: "#82A33D", borderColor: "#82A33D" }}
          disabled={!findClicked}
          onClick={() => onBook(id)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
