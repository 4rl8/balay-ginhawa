import {Link} from 'react-router-dom';



export function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/accommodations">Accommodations</Link></li>
          <li><Link to="/amenities">Amenities</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/faqs">FAQs</Link></li> 
            <li><Link to="/booking">Booking</Link></li>
        </ul>
        <button>Book Now</button>
      </nav>
    </header>
  );
}
