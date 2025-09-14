import bookBG from '../assets/images/bookBG.svg';
import { Cart } from "./Cart";

export function Rooms() {
    return (
        <>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 pl-[10%] text-left mt-10">Available Rooms</h2>

            <div className='flex gap-50'>
                {/* Rooms List */}
                <div className='flex-col pl-[10%] col-span-3 space-y-6 w-[60%] '>
                    <div className="bg-white border border-gray-300 rounded-md w-full p-8 relative flex">
                        <div className="w-2/3 flex items-center justify-center">
                            <img
                                src={bookBG}
                                alt="Room"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
                                <p className="text-gray-600 mb-2">
                                    Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
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
                                <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md w-full p-8 relative flex">
                        <div className="w-2/3 flex items-center justify-center">
                            <img
                                src={bookBG}
                                alt="Room"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
                                <p className="text-gray-600 mb-2">
                                    Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
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
                                <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md w-full p-8 relative flex">
                        <div className="w-2/3 flex items-center justify-center">
                            <img
                                src={bookBG}
                                alt="Room"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
                                <p className="text-gray-600 mb-2">
                                    Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
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
                                <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md w-full p-8 relative flex">
                        <div className="w-2/3 flex items-center justify-center">
                            <img
                                src={bookBG}
                                alt="Room"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
                                <p className="text-gray-600 mb-2">
                                    Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
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
                                <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md w-full p-8 relative flex">
                        <div className="w-2/3 flex items-center justify-center">
                            <img
                                src={bookBG}
                                alt="Room"
                                className="w-full h-80 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe Room</h3>
                                <p className="text-gray-600 mb-2">
                                    Enjoy a spacious room with modern amenities, perfect for relaxation and comfort during your stay.
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
                                <button className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-none hover:bg-blue-600 transition duration-300">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Cart />
                </div>

            </div>

        </>

    );
}