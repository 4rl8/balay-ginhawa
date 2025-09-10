import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

export function Header() {
  return (
    <header>
      <nav className="flex items-center p-4 text-white h-25">
        {/* Logo on the left */}
        <div className="flex items-center h-full">
          <img className="h-full ml-15" src={logo} alt="balay Ginhawa Logo" />
        </div>
        {/* Nav links in the center */}
        <div className="flex-1 flex justify-center items-center h-full">
          <ul className="flex space-x-4 h-full items-center">
            <li className="list-none">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Home
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/accommodations"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Accommodations
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/amenities"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Amenities
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                About Us
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/faqs"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                FAQs
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Booking 
              </NavLink>
            </li>
          </ul>
        </div>
        {/* Book Now button on the right */}
        <Link to="/book-now">
          <button className="border-2 border-white text-white bg-transparent py-2 px-4 rounded-3xl  h-11">
            Book Now
          </button>
        </Link>
      </nav>
    </header>
  );
}
