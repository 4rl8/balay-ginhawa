import { Link } from 'react-router-dom';
import close from '../assets/images/close.svg';
import BookNowBG from '../assets/images/BookNow.png';
import { SearchBar } from './booking/SearchBar';


export function BookNow() {
    return (
        <>  
        <div className='min-h-screen bg-cover bg-center' style={{ backgroundImage: `url(${BookNowBG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <Link to="/"><img src={close} className='ml-auto mr-[10%] py-[5%]' /></Link>

        <h1 className='text-center text-white text-3xl font-bold pb-10'>BOOK YOUR STAY</h1>

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
                    style={{ backgroundColor: '#82A33D' }}
                >
                    CHECK AVAILABILITY
                </button>

            
            </div>
        </div>
        
        </div>
        
      
        </>
       
    );
}