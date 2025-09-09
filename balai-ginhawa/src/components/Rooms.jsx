import bookBG from '../assets/images/bookBG.svg';

export function CreateRooms() {
    return (
          <div className="bg-white border border-gray-300 rounded-md w-[50%] p-8 relative flex">

          <div className="w-2/3 ">
            <img
              src={bookBG}
              alt="Room"
              className="w-full h-80 object-cover rounded-md"
            />
          </div>

          <div className="w-2/3 pl-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
              <p className="text-gray-600 mb-4">
                Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
              </p>
            </div>

            <div className="flex justify-end">
              <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                Book Now
              </button>
            </div>
          </div>
        </div>
    );
}