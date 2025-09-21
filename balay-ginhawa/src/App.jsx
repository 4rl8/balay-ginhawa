import './App.css'
import { HomePage } from './pages/HomePage.jsx'
import {AboutUs} from './pages/AboutUs.jsx'
import {Accommodations} from './pages/Accommodations.jsx'
import {Amenities} from './pages/Amenities.jsx'
import {FAQs} from './pages/FAQs.jsx'
import {Booking} from './pages/Booking.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {BookNow} from './pages/BookNow.jsx'
import { FrontDeskBookings } from './pages/front-desk/FrontDeskBookings'
import { FrontDeskRooms } from './pages/front-desk/FrontDeskRooms.jsx'
import { FrontDeskPayments } from './pages/front-desk/FrontDeskPayments.jsx'
import { FrontDeskNotifications } from './pages/front-desk/FrontDeskNotifications'
// import { db } from './config/firebase-config'
// import { useEffect } from 'react'
// import { onSnapshot, collection } from 'firebase/firestore'



function App() {

  // useEffect (() => {  
  //   onSnapshot(collection(db, "bookings"), (snapshot) => {
  //     console.log(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
  //   });
  // }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/accommodations' element={<Accommodations />} />
        <Route path='/amenities' element={<Amenities />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/book-now' element={<BookNow />} />
        <Route path='/frontdesk' element={<FrontDeskBookings />} />
        <Route path='/frontdesk/rooms' element={<FrontDeskRooms />} />
        <Route path='/frontdesk/payments' element={<FrontDeskPayments />} />
        <Route path='/frontdesk/notifications' element={<FrontDeskNotifications />} />
      </Routes>
    </>
  );
}

export default App
