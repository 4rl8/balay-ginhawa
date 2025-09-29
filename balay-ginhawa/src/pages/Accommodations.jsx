import { useState } from "react";
import { Header } from "../components/Header";
import accomBG from '../assets/images/accomBG.svg';
import divider from '../assets/images/divider.svg';
// import standardImg from '../assets/images/standardImg.svg';
// import twinImg from '../assets/images/twinImg.svg';
// import deluxeImg from '../assets/images/deluxeImg.svg';
// import familySuiteImg from '../assets/images/familySuiteImg.svg';
// import penthouseImg from '../assets/images/penthouseImg.svg';
import standard from '../assets/images/standard2.png';
import twin from '../assets/images/twin2.png';
import deluxe from '../assets/images/deluxe2.png';
import family from '../assets/images/family2.png';
import penthouse from '../assets/images/penthouse2.png';
import { Footer } from "@/components/footer";

const rooms = [
  {
    title: "Standard Room",
    img: standard,
    desc: "A cozy room perfect for solo travelers or couples, featuring essential amenities for a comfortable stay."
  },
  {
    title: "Twin Room",
    img: twin,
    desc: "Designed for friends or colleagues, featuring two separate single beds with all standard conveniences."
  },
  {
    title: "Deluxe Room",
    img: deluxe,
    desc: "Enjoy extra space and upgraded amenities in our deluxe room, designed for comfort and convenience."
  },
  {
    title: "Family Suite",
    img: family,
    desc: "Spacious suite for families, with multiple beds and a living area to ensure everyone feels at home."
  },
  {
    title: "Penthouse",
    img: penthouse,
    desc: "Experience luxury in our penthouse suite, featuring panoramic views and premium facilities."
  }
];

export function Accommodations() {
  const [modalImg, setModalImg] = useState(null);

  return (
    <>
      <title>Accommodations</title>
      <div className="relative text-white">
        <img
          src={accomBG}
          alt="balay Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="ml-10 p-8 text-white px-10 py-8 ml-20">
          <h1 className="text-4xl font-bold">Accommodations</h1>
          <p className="text-2xl">Explore our comfortable accommodations.</p>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />
      </div>

      <div className="container mx-auto p-4 py-5">
        <div className="flex flex-wrap justify-center gap-8">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md flex flex-col items-center p-6"
              style={{
                width: "100%",
                maxWidth: "40%",
                flexBasis: "100%",
              }}
            >
              <img
                src={room.img}
                alt={room.title}
                className="w-full h-[30vh] object-cover rounded-md mb-4 cursor-pointer"
                onClick={() => setModalImg(room.img)}
              />
              <h2 className="text-xl font-bold mb-2 text-gray-800 text-left w-full">{room.title}</h2>
              <p className="text-gray-600 text-left w-full">{room.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {modalImg && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Dimmer background, more opacity */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setModalImg(null)}
            style={{ zIndex: 50 }}
          />
          {/* Animated image popup without shadow */}
          <img
            src={modalImg}
            alt="Room Preview"
            className="w-[180vw] max-w-none h-auto max-h-[90vh] rounded-lg transition-all duration-300 scale-67 animate-fade-in"
            style={{ zIndex: 51, position: "relative" }}
          />
          <button
            className="absolute top-6 right-8 text-white text-4xl font-bold bg-black/40 rounded-full px-4 py-2"
            onClick={() => setModalImg(null)}
            aria-label="Close"
            style={{ zIndex: 52 }}
          >
            &times;
          </button>
          <style>
            {`
              @keyframes fade-in {
                from { opacity: 0; transform: scale(0.85);}
                to { opacity: 1; transform: scale(1);}
              }
              .animate-fade-in {
                animation: fade-in 0.2s ease;
              }
            `}
          </style>
        </div>
      )}
      <Footer />
    </>
  );
}