import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle function for mobile menu
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Features", path: "/Features" },
    { name: "Channels", path: "/Channels" },
    { name: "Resources", path: "/Resources" },
    { name: "Messages", path: "/Messages" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
      >
        {/* LOGO SECTION */}
        <div className="flex-1">
          <Link to="/" className="flex items-start gap-2 group py-2.5">          
            <span className="text-4xl font-bold text-white">
              Schedly<span className="text-blue-600">.</span>
            </span>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-white"
          >
            <span className="sr-only">Open main menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xl font-bold text-white hover:text-blue-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 items-center">
          <Link to="/login" className="text-2xl font-semibold text-white hover:text-blue-600">
            Log in 
          </Link>
          {/* <button 
            onClick={() => navigate('/register')}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-all"
          >
            Start Free
          </button> */}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto bg-gray-900 px-6 py-6 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white">Schedly.</span>
            <button onClick={toggleMenu} className="text-gray-400">
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7">
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg> */}
            </button>
          </div>
          <div className="mt-10 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={toggleMenu}
                className="block rounded-lg px-3 py-4 text-lg font-semibold text-white hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/10 my-6" />
            <Link
              to="/login"
              onClick={toggleMenu}
              className="block px-3 py-4 text-lg font-semibold text-white"
            >
              Log in
            </Link>
            {/* <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4">
              Get Started
            </button> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;