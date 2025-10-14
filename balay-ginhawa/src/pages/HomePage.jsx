import { Header } from "../components/Header";
import homeBG from '../assets/images/homeBG.svg';
import homeimg1 from '../assets/images/home-img1.svg';
import homeimg2 from '../assets/images/home-img2.svg';
import homeimg3 from '../assets/images/home-img3.svg';
import standard from "../assets/images/standard2.png";
import feature1 from "../assets/images/feature1.jpg";
import feature2 from "../assets/images/feature2.jpg";
import feature3 from "../assets/images/feature3.jpg";
import twin from "../assets/images/twin2.png";
import deluxe from "../assets/images/deluxe2.png";
import familySuite from "../assets/images/family2.png";
import pentHouse from "../assets/images/penthouse2.png";
import { Footer } from "@/components/footer";
import ChatBot from "@/components/ChatBot/ChatBot";

export function HomePage() {
  return (
    <>
      <title>Balay Ginhawa</title>
      <div className="relative">
        <img
          src={homeBG}
          alt="balay Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-90 object-cover -z-10"
        />
        <Header />
        <div className="p-8 text-white py-8 ml-20 mt-20 h-40">
          <h1 className="text-5xl font-bold">Your Perfect Stay</h1>
          <h2 className="text-5xl font-bold" style={{ color: "#82A33D" }}>Starts Here</h2>
          <p>“Let us take care of the details while you focus on enjoying your time away.”</p>
        </div>
      </div>

      <div className="mx-auto px-4 py-20 w-[80%]">
        <div className="flex flex-col md:flex-row gap-6 items-start ">
          <div className="md:w-[60%] w-full bg-white/10 rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Balay Ginhawa</h2>
            <p>
              Balay means home, and Ginhawa means relief—together, they capture the essence of what we offer: a place where warmth, rest, and Filipino culture come together.
            </p>
            <p className="pt-10">    At Balay Ginhawa, every corner is inspired by the Philippines—its traditions, its hospitality, and its natural beauty. Whether you are here for relaxation, a cultural escape, or simply a break from the everyday, our doors are always open to welcome you like family.
              Come home to comfort. Experience the true meaning of ginhawa.</p>
          </div>

          <div className="md:w-[40%] w-full">
            <div className="flex md:flex-row flex-col w-full gap-4">
              <div className="md:w-[60%] w-full">
                <img
                  src={homeimg1}
                  alt="Preview 1"
                  className="w-full md:h-[17rem] h-48 object-cover rounded-md"
                />
              </div>
              <div className="md:w-[40%] w-full flex md:flex-col flex-row gap-4">
                <img
                  src={homeimg2}
                  alt="Preview 2"
                  className="w-full md:h-[8rem] h-48 object-cover rounded-md"
                />
                <img
                  src={homeimg3}
                  alt="Preview 3"
                  className="w-full md:h-[8rem] h-48 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="w-full bg-[#f7fafc] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#82A33D]">Why Choose Balay Ginhawa?</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img src={feature1} alt="Nature" className="w-20 h-20 mb-4 rounded-full object-cover" />
              <h3 className="text-xl font-semibold mb-2">Nature-Inspired Retreat</h3>
              <p className="text-gray-600 text-center">
                Surrounded by lush gardens and tranquil views, our property is a sanctuary for relaxation and rejuvenation.
              </p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img src={feature2} alt="Filipino Hospitality" className="w-20 h-20 mb-4 rounded-full object-cover" />
              <h3 className="text-xl font-semibold mb-2">Authentic Filipino Hospitality</h3>
              <p className="text-gray-600 text-center">
                Experience warm, personalized service and a genuine sense of home, rooted in Filipino values.
              </p>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img src={feature3} alt="Amenities" className="w-20 h-20 mb-4 rounded-full object-cover" />
              <h3 className="text-xl font-semibold mb-2">Modern Comforts & Amenities</h3>
              <p className="text-gray-600 text-center">
                Enjoy well-appointed rooms, delicious local cuisine, and amenities designed for your comfort and convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#82A33D]">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <img src={standard} alt="Standard Room" className="w-full h-56 object-cover rounded-lg shadow" />
          <img src={twin} alt="Twin Room" className="w-full h-56 object-cover rounded-lg shadow" />
          <img src={deluxe} alt="Deluxe Room" className="w-full h-56 object-cover rounded-lg shadow" />
          <img src={familySuite} alt="Family Suite" className="w-full h-56 object-cover rounded-lg shadow" />
          <img src={pentHouse} alt="Penthouse" className="w-full h-56 object-cover rounded-lg shadow" />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full bg-[#f7fafc] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#82A33D]">What Our Guests Say</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">
                “A truly relaxing experience! The staff made us feel like family and the food was amazing.”
              </p>
              <div className="font-semibold text-[#82A33D]">– Maria S.</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">
                “The gardens are beautiful and the rooms are spotless. We’ll definitely be back!”
              </p>
              <div className="font-semibold text-[#82A33D]">– John D.</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">
                “Perfect for a family getaway. Our kids loved the amenities and we loved the peace and quiet.”
              </p>
              <div className="font-semibold text-[#82A33D]">– The Reyes Family</div>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot and Footer */}
      <ChatBot />
      <Footer />
    </>
  );
}