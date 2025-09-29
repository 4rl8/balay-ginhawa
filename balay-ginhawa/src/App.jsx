import './App.css'
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage.jsx'
import {AboutUs} from './pages/AboutUs.jsx'
import {Accommodations} from './pages/Accommodations.jsx'
import {Amenities} from './pages/Amenities.jsx'
import {FAQs} from './pages/FAQs.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {BookNow} from './pages/BookNow.jsx'
import { FrontDeskBookings } from './pages/front-desk/FrontDeskBookings'
import { FrontDeskRooms } from './pages/front-desk/FrontDeskRooms.jsx'
import { FrontDeskPayments } from './pages/front-desk/FrontDeskPayments.jsx'
import { FrontDeskNotifications } from './pages/front-desk/FrontDeskNotifications'
import AdminLogin from './pages/AdminLogin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoggedRoute from './components/LoggedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
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
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/accommodations' element={<Accommodations />} />
        <Route path='/amenities' element={<Amenities />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/book-now' element={<BookNow />} />

     {/* Admin login - only when not logged in */}
        <Route
          path='/adminlogin'
          element={
            <LoggedRoute>
              <AdminLogin />
            </LoggedRoute>
          }
        />
        {/* Protected Frontdesk routes */}
        <Route path='/frontdesk' element={
          <ProtectedRoute><FrontDeskBookings /></ProtectedRoute>
        } />
        <Route path='/frontdesk/rooms' element={
          <ProtectedRoute><FrontDeskRooms /></ProtectedRoute>
        } />
        <Route path='/frontdesk/payments' element={
          <ProtectedRoute><FrontDeskPayments /></ProtectedRoute>
        } />
        <Route path='/frontdesk/notifications' element={
          <ProtectedRoute><FrontDeskNotifications /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
