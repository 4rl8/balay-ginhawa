import logo from "../assets/images/logo.svg";
import instagram from "../assets/icons/instagram.svg";
import facebook from "../assets/icons/facebook.svg";
import twitter from "../assets/icons/twitter.svg";
import linkedin from "../assets/icons/linkedin.svg";
import arrow from "../assets/icons/arrow.svg";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 px-4 md:px-20 mt-20" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
       
                <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
                   <div className="flex items-center mb-4 gap-5">
                     <img src={logo} alt="Logo" className="w-32 mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-white">Balay Ginhawa</h2>
                   </div>
                    <p className="mb-6 text-gray-400">
Discover "Balay Ginhawa", an extraordinary boutique retreat where tranquility, culture, and comfort seamlessly blend. More than just a place to stay.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Instagram">
                            <img src={instagram} alt="Instagram" className="w-6 h-6 hover:opacity-80" />
                        </a>
                        <a href="#" aria-label="Facebook">
                            <img src={facebook} alt="Facebook" className="w-6 h-6 hover:opacity-80" />
                        </a>
                        <a href="#" aria-label="Twitter">
                            <img src={twitter} alt="Twitter" className="w-6 h-6 hover:opacity-80" />
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <img src={linkedin} alt="LinkedIn" className="w-6 h-6 hover:opacity-80" />
                        </a>
                    </div>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-10">
                    <div>
                        <h3 className="font-semibold text-lg mb-3 text-white">COMPANY</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">About</a></li>
                            <li><a href="#" className="hover:text-white">Careers</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                            <li><a href="#" className="hover:text-white">Partners</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-3 text-white">SUPPORT</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Safety Information</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white">Accessibility</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex-1 min-w-[220px]">
                    <h3 className="font-semibold text-lg mb-3 text-white">STAY UPDATED</h3>
                    <p className="mb-4 text-gray-400">Subscribe to our newsletter for travel inspiration and special offers.</p>
                    <form className="flex items-center bg-gray-800 rounded overflow-hidden">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-transparent px-4 py-2 text-gray-200 focus:outline-none w-full"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2">
                            <img src={arrow} alt="Subscribe" className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-10 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Balay Ginhawa. All rights reserved.
            </div>
        </footer>
    );
}