import { Header } from "../components/Header";
import homeBG from '../assets/images/homeBG.svg';
import divider from '../assets/images/divider.svg';
  

export function AboutUs() {
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
          <h1 className="text-4xl font-bold">About Us</h1>
          <h2 className="text-2xl">Learn more about our mission and values.</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto m-0" />
      </div>
    </>
  );
}