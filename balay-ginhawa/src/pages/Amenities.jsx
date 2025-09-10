import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import homeBG from '../assets/images/homeBG.svg';
import restoBar from '../assets/images/restoBar.svg';
import wifi from '../assets/images/wifi.svg';
import roomService from '../assets/images/roomService.svg';

export function Amenities() {
  return (
    <>
      <>
        <title>balay Ginhawa</title>
        <div className="relative">

          <img
            src={homeBG}
            alt="balay Ginhawa Logo"
            className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
          />
          <Header />
          <div className="p-8 text-white px-20 py-8"  >
            <h1 className="text-4xl font-bold">Amenities</h1>
            <h2 className="text-2xl">Discover our range of amenities.</h2>
          </div>
          <img src={divider} alt="" className="w-full h-auto" />
        </div>

        <div className=" w-full flex gap-5 p-8 px-10 py-8">
          <div className=" w-full flex-col gap-5 p-8 px-10 py-8">
            <img src={restoBar} alt="" className="w-100% h-auto" />
            <div className=" p-8 text-black px-10 py-8"  >
              <img></img>
              <h3>Resto Bar</h3>
              <p>Enjoy a variety of delicious meals and refreshing drinks at our in-house restaurant and bar.</p>
            </div>
          </div>
          <div className=" w-full flex-col gap-5 p-8 px-10 py-8">
            <img src={roomService} alt="" className="w-100% h-auto" />
                 <div className=" p-8 text-black px-10 py-8"  >
              <img></img>
              <h3>Room Service</h3>
              <p>Indulge in our 24-hour room service, offering a wide selection of meals and beverages delivered right to your door.</p>
            </div>
          </div>
          <div className=" w-full flex-col gap-5 p-8 px-10 py-8">
            <img src={wifi} alt="" className="w-100% h-auto" />
                 <div className=" p-8 text-black px-10 py-8"  >
              <img></img>
              <h3>Wifi</h3>
              <p>Stay connected with our high-speed wifi available throughout the property.</p>
            </div>
          </div>
        </div>



      </>
    </>
  );
}