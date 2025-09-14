import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import homeBG from '../assets/images/homeBG.svg';
import homeimg1 from '../assets/images/home-img1.svg';
import homeimg2 from '../assets/images/home-img2.svg';
import homeimg3 from '../assets/images/home-img3.svg';


export function HomePage() {
  return (
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
          <h1 className="text-4xl font-bold">Your Perfect Stay</h1>
          <h2 className="text-2xl">Starts Here</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />\
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
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

    </>
  );
}