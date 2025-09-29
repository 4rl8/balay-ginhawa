import { Header } from "../components/Header";
import homeBG from '../assets/images/homeBG.svg';
// import hellyeah from '../assets/images/homeBG2.svg';
import homeimg1 from '../assets/images/home-img1.svg';
import homeimg2 from '../assets/images/home-img2.svg';
import homeimg3 from '../assets/images/home-img3.svg';
import { Footer } from "@/components/footer";
import homeimg4 from '../assets/images/BookNow.png';
// import { db } from "@/config/firebase-config";
// import { useState } from "react";
// import { useEffect } from "react";
// import { collection, getDocs } from "firebase/firestore";

 

export function HomePage() {


  // const [rooms, setRooms] = useState([]);

  // // read data from firestore
  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     const roomsCollection = collection(db, "rooms");
  //     try {
  //       const roomSnapshot = await getDocs(roomsCollection);
  //       const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setRooms(roomList);
  //     } catch (error) {
  //       console.error("Error fetching rooms:", error);
  //     }
  //   };  

  //   fetchRooms();
      
  // }, []);


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

      <div className="md:w-[40%] w-full">
        <img src={homeimg4} alt="" />
      </div>

    <Footer />
    </>
  );
}