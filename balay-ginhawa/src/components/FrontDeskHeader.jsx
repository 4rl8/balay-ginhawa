import logo from "../assets/images/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export function FrontDeskHeader() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleLogoutConfirmed = async () => {
    try {
      await logout(); // clears context + localStorage and updates Firestore
    } catch (err) {
      // still proceed to navigate even if logout encountered an issue
      console.error("Logout error:", err);
    }
    navigate("/adminlogin"); // redirect back to login
  };

  return (
    <header className="border-b-4 border-green-500">
      <nav className="flex items-center justify-between p-4 text-black">
        {/* Left: Logo + App title */}
        <div className="flex items-center gap-4">
          <img className="h-12" src={logo} alt="Balay Ginhawa Logo" />
          <div>
            <div className="font-semibold text-lg">Balay Ginhawa</div>
            <div className="text-xs text-gray-600">Front Desk</div>
          </div>
        </div>

        {/* Right: Admin profile / logout */}
        <div className="flex items-center gap-4">
          {/* Show admin name if available */}
          {admin?.name ? (
            <div className="hidden sm:flex flex-col text-right mr-2">
              <span className="text-sm font-medium">{admin.name}</span>
              <span className="text-xs text-gray-500">{admin.adminId || "Admin"}</span>
            </div>
          ) : null}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <UserCircleIcon className="h-7 w-7 text-gray-700" />
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setConfirmOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Logout</span>
                </button>
                {/* Future: add Profile link here */}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/30"
        >
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
            <h3 className="text-lg font-semibold">Confirm logout</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to logout?</p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirmed}
                className="px-3 py-2 bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
