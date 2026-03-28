import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Channels", path: "/channels" },
    { name: "Pricing", path: "/pricing", hasArrow: true },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <header className="sticky top-0 z-50 px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center">

        {/* LOGO — left, no absolute */}
        <div className="flex flex-1 justify-start">
        <Link to="/" className="text-4xl font-bold text-black shrink-0">
          Schedly.
        </Link>
        </div>

        {/* PILL NAV — centered */}
        <div className = "hidden lg:flex flex-1 justify-center">
        <nav className="hidden lg:flex items-center gap-1 bg-white rounded-full px-2 py-1.5 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-2xl font-medium text-gray-800 px-5 py-2 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {link.name}{link.hasArrow ? " ▾" : ""}
            </Link>
          ))}
        </nav>
        </div>

        {/* AUTH BUTTONS — right, no absolute */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
          <Link
            to="/login"
            className="text-lg font-semibold text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
            {mobileOpen
              ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
            }
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-2xl p-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-gray-800 rounded-xl hover:bg-gray-50"
            >
              {link.name}
            </Link>
          ))}
          <hr className="my-3 border-gray-100" />
          <Link to="/login" onClick={() => setMobileOpen(false)} className="block mt-2 text-center bg-blue-600 text-white font-semibold py-3 rounded-xl">
            Log in
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;