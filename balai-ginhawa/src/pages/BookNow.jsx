import { Link } from 'react-router-dom';
import close from '../assets/images/close.svg';

export function BookNow() {
    return (
        <>  
        <Link to="/"><img src={close} className='ml-auto mr-[10%] py-[5%]' /></Link>
        <div className="flex justify-center items-center">
            <div className="bg-white border border-gray-300 rounded-md px-10 py-8 flex flex-col items-center w-[40%]">
                <div className="flex flex-row items-center w-full mb-4 space-x-4">
                    <span className="text-gray-700 w-1/2 font-medium">Check-in:</span>
                    <input
                        type="date"
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none w-full"
                        placeholder="Check-in Date"
                    />
                </div>
                <div className="flex flex-row items-center w-full mb-4 space-x-4">
                    <span className="text-gray-700 w-1/2 font-medium">Check-out:</span>
                    <input
                        type="date"
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none w-full"
                        placeholder="Check-out Date"
                    />
                </div>
                <div className="flex flex-row items-center w-full mb-6 space-x-4">
                    <span className="text-gray-700 w-1/2 font-medium">Guests:</span>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        defaultValue="1"
                        className="px-4 py-2 rounded border border-gray-300 focus:outline-none w-full"
                        placeholder="Number of Guests"
                    />
                </div>
                <button
                    className="border-2 border-blue-500 bg-blue-500 text-white py-2 px-6 w-full rounded-none"
                >
                    Find
                </button>
            </div>
        </div>
        </>
       
    );
}