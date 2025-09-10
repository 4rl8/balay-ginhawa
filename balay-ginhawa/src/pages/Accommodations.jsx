import { Header } from "../components/Header";
import accomBG from '../assets/images/accomBG.svg';
import divider from '../assets/images/divider.svg';

export function Accommodations() {
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
        <div className="ml-10 p-8 text-white px-10 py-8">
          <h1 className="text-4xl font-bold">Accommodations</h1>
          <p className="text-2xl">Explore our comfortable accommodations.</p>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />

      </div>




    </>
  );
}