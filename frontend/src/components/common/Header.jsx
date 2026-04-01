import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Features from "../../Modals/Features";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [isOpen,setIsOpen] = useState(false); 
  const [activeModal, setActiveModal] = useState(null);


 const navLinks = [
  { name: "Features", type: "modal", modal: "features"  },
  { name: "Channels", type: "modal", modal: "channels" },
  { name: "Pricing", type: "link", path: "/pricing" },
  { name: "Resources", type: "modal", modal: "resources" },
];

  return (
    <header className="sticky top-0 z-50 px-6 py-5">
      <div className="mx-auto flex flex-row max-w-7xl items-center">   

        {/* LOGO — left, no absolute */}
        <div className="flex flex-1 justify-start">
        <Link to="/" className="text-6xl font-avallon alt text-black shrink-0">
          Schedly.
        </Link>
        </div>


        {/* PILL NAV — centered */}
        <div className = "hidden lg:flex flex-1 justify-center">
        <nav className="flex items-center gap-1 bg-white rounded-full px-2 py-1.5 shadow-md">
  {navLinks.map((link) => {
    if (link.type === "modal") {
      
      return (
        <button
          key={link.name}
          onClick={(e) => { 
            e.stopPropagation();
            setActiveModal(activeModal === link.modal ? null : link.modal) }
          }
          className="text-2xl font-medium text-gray-800 px-5 py-2 rounded-full hover:bg-gray-100 transition whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span>{link.name}</span>
            {activeModal === link.modal ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            )}
          </div>
        </button>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.path}
        className="text-2xl font-medium text-gray-800 px-5 py-2 rounded-full hover:bg-gray-100 transition whitespace-nowrap"
      >
        {link.name}
      </Link>
    );
  })}
</nav>

                <Features
  isOpen={activeModal === "features"}
  setOpen={() => setActiveModal(null)}
/> 
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
              {/* {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />} */}
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