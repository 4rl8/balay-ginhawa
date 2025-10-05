import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import aboutImg from '../assets/images/aboutImg.svg';
import aboutImg2 from '../assets/images/aboutImg2.svg';
import aboutBG from '../assets/images/aboutBG.svg';
import { Footer } from "@/components/footer";
import ChatBot from "@/components/ChatBot/ChatBot";



export function AboutUs() {
  return (
    <>
      <title>About Us</title>
      <div className="relative">

        <img
          src={aboutBG}
          alt="balay Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="p-8 text-white ml-20 py-8"  >
          <h1 className="text-4xl font-bold">About Us</h1>
          <h2 className="text-2xl">Learn more about our mission and values.</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto m-0" />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center w-[70%] py-10 m-auto">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center mr-20 ">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 ">Our Story</h2>
          <p className="text-gray-700 text-l text-justify max-w-lg">
            Our services are all about making your stay enjoyable, relaxing, and worry-free.
            From the moment you arrive, our team is here to take care of the little details so you can simply sit back, feel comfortable, and make the most of your time with us. Whether it’s enjoying our cozy rooms, friendly hospitality, or convenient facilities, we’re here to make sure you have a great time and truly enjoy your stay.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={aboutImg2}
            alt="About Balay Ginhawa"
            className="w-full max-w-md h-auto rounded-lg shadow"
          />
        </div>

      </div>

      <div className="flex flex-col md:flex-row justify-center items-center w-[70%] m-auto py-10">
        <div className="w-full md:w-1/2 mr-20 flex justify-center items-center">
          <img
            src={aboutImg}
            alt="About Balay Ginhawa"
            className="w-full max-w-md h-auto rounded-lg shadow"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Make you feel home</h2>
          <p className="text-gray-700 text-l text-justify max-w-lg">
            We want you to feel right at home the moment you step through our doors.
            From cozy rooms and welcoming spaces to our caring staff who are always ready with a smile, everything is designed to make your stay warm and comfortable. Whether you’re here to relax, explore, or simply unwind, we’ll make sure you feel cared for, just like family.
          </p>
        </div>

      </div>

      <ChatBot />

      <Footer />

    </>
  );
}