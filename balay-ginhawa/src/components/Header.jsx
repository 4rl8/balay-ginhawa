import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import { useState } from 'react';

export function Header() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/accommodations", label: "Accommodations" },
    { to: "/amenities", label: "Amenities" },
    { to: "/about-us", label: "About Us" },
    { to: "/faqs", label: "FAQs" },
    { to: "/booking", label: "Booking" },
  ];

  return (
    <header>
      <nav className="flex items-center p-4 text-white h-25 ml-10 mr-20">
        <div className="flex items-center h-full">
          <img className="h-full ml-15" src={logo} alt="balay Ginhawa Logo" />
          <h1 className="text-xl font-bold text-white pl-3 ">Balay Ginhawa</h1>
        </div>
        <div className="flex-1 flex justify-center items-center h-full">
          <ul className="flex space-x-3 h-full items-center">
            {navLinks.map(({ to, label }, idx) => (
              <li key={to} className="list-none">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative px-2 py-1 transition-colors duration-300 group${
                      isActive ? " font-semibold text-white" : ""
                    }`
                  }
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <span className="relative z-10">{label}</span>
                  {/* Underline logic: show if active and no other is hovered, or if hovered */}
                  <span
                    className={`
                      absolute left-0 bottom-0 w-full h-0.5
                      bg-white
                      transition-transform duration-300 origin-left
                      ${hoveredIdx === idx || (hoveredIdx === null && window.location.pathname === to)
                        ? "scale-x-100"
                        : "scale-x-0"
                      }
                    `}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/book-now">
          <button className="border-2 border-white text-white bg-transparent py-2 px-4 rounded-3xl  h-11">
            Book Now
          </button>
        </Link>
      </nav>
    </header>
  );
}
