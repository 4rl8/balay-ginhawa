import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header>
      <nav className="flex items-center justify-between p-4 text-white ">
        <div className="flex-1 flex justify-center">
          <ul className="flex space-x-4">
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
        <button  className="border-2 border-white  text-white bg-transparent py-2 px-4 rounded-3xl ml-4 w-35 h-12">Book Now</button>
      </nav>
    </header>
  );
}
