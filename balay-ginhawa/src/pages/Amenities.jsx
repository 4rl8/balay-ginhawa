import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import amenBG from '../assets/images/amenBG.svg';
import breakfast from '../assets/images/breakfast.svg';
import wifi from '../assets/images/wifi.svg';
import roomService from '../assets/images/roomService.svg';
import dailyService from '../assets/images/dailyService.svg';
import fitness from '../assets/images/fitness.svg';
import { Footer } from "@/components/footer";

export function Amenities() {
  return (
    <>
        <title>Amenities</title>
        <div className="relative">

          <img
            src={amenBG}
            alt="balay Ginhawa Logo"
            className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
          />
          <Header />
          <div className="p-8 text-white py-8 ml-20"  >
            <h1 className="text-4xl font-bold">Amenities</h1>
            <h2 className="text-2xl">Discover our range of amenities.</h2>
          </div>
          <img src={divider} alt="" className="w-full h-auto" />
        </div>

         <div className="w-full flex flex-row gap-5 p-8 justify-center items-start">
    
        <div className="flex flex-col items-center gap-5 w-1/3">
          <img src={roomService} alt="" className="w-72 h-auto m-auto" />
          <h3 className="text-center w-72 text-xl font-bold">Room Service</h3>
          <p className="text-center w-72">
            Indulge in our 24-hour room service, offering a wide selection of meals and beverages delivered right to your door.
          </p>
        </div>
      
        <div className="flex flex-col items-center gap-5 w-1/3">
          <img src={wifi} alt="" className="w-72 h-auto m-auto" />
          <h3 className="text-center w-72 text-xl font-bold">Wifi</h3>
          <p className="text-center w-72">
            Stay connected with our high-speed wifi available throughout the property.
          </p>
        </div>
      </div>


      <div className="w-full flex flex-row gap-20 p-8 justify-center items-start pt-30">
        <div className="w-80 text-center">
          <img src={breakfast} alt="" className="w-96 h-auto m-auto" />
          <p className="text-xl font-bold pt-5 pb-5">Complementary Breakfast</p>
          <p>Stay connected effortlessly throughout the property.</p>
        </div>
        <div className="w-80 text-center">
          <img src={dailyService} alt="" className="w-96 h-auto m-auto" />
          <p className="text-xl font-bold pt-5 pb-5">Daily Housekeeping</p>
          <p>Clean, comfortable spaces every day.</p>
        </div>
        <div className="w-80 text-center">
          <img src={fitness} alt="" className="w-96 h-auto m-auto" />
          <p className="text-xl font-bold pt-5 pb-5">Fitness Center</p>
          <p>Stay on track with your workout routine.</p>
        </div>
      </div>


      <Footer />
    </>
  );
}