import logo from "../assets/images/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function FrontDeskHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears context + localStorage
    navigate("/adminlogin"); // redirect back to login
  };

  return (
    <header className="border-b-4 border-green-500">
      <nav className="flex items-center justify-between p-4 text-black">
        {/* Left: Logo */}
        <div className="flex items-center h-full">
          <img className="h-12" src={logo} alt="Balay Ginhawa Logo" />
        </div>

        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
