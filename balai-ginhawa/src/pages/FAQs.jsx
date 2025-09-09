import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import homeBG from '../assets/images/homeBG.svg';

export function FAQs() {
  return (
    <>
      <title>Balai Ginhawa</title>
      <div className="relative">

        <img
          src={homeBG}
          alt="Balai Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="p-24 text-white py-10"  > 
          <h1 className="text-4xl font-bold">FAQs</h1>
          <h2 className="text-2xl">Frequently Asked Questions</h2>
        </div>
                <img src={divider} alt="" className="w-full h-auto" />
        
      </div>
    </>
  );
}