import './App.css'
import { HomePage } from './pages/HomePage.jsx'
import {AboutUs} from './pages/AboutUs.jsx'
import {Accommodations} from './pages/Accommodations.jsx'
import {Amenities} from './pages/Amenities.jsx'
import {FAQs} from './pages/FAQs.jsx'
import {Booking} from './pages/Booking.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/accommodations' element={<Accommodations />} />
        <Route path='/amenities' element={<Amenities />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/booking' element={<Booking />} />
      </Routes>
    </>
  );
}

export default App
