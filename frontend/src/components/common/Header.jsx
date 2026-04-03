import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Features from "../../Modals/Features";
import Chennals from "../../Modals/Chennals";
import Madefor from "../../Modals/Madefor";
import Resources from "../../Modals/Resources";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveModal(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Features", type: "modal", modal: "features" },
    { name: "Channels", type: "modal", modal: "channels" },
    { name: "Madefor", type: "modal", modal: "madefor" },
    { name: "Resources", type: "modal", modal: "resources" },
  ];

  return (
    <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex flex-row max-w-7xl items-center">

        {/* LOGO */}
        <div className="flex flex-1 justify-start">
          <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
            Schedly.
          </Link>
        </div>

        {/* NAV */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">

            {navLinks.map((link) => {
              if (link.type === "modal") {
                return (
                  <div key={link.name} className="relative">

                    {/* BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModal(
                          activeModal === link.modal ? null : link.modal
                        );
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${
                          activeModal === link.modal
                            ? "bg-gray-100 text-black shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                        }`}
                    >
                      <span>{link.name}</span>
                      {activeModal === link.modal ? (
                        <IoIosArrowUp size={16} />
                      ) : (
                        <IoIosArrowDown size={16} />
                      )}
                    </button>

                    {/* DROPDOWN */}
                    {activeModal === link.modal && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-in fade-in zoom-in-95 duration-200">

                        {link.modal === "features" && (
                          <Features />
                        )}

                        {link.modal === "channels" && (
                          <Chennals />
                        )}

                        {link.modal === "madefor" && (
                          <Madefor />
                        )}

                        {link.modal === "resources" && (
                          <Resources />
                        )}

                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* LOGIN */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-white bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            Log in
          </Link>
        </div>

        {/* MOBILE BUTTON */}
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
  <div className="lg:hidden mt-4 bg-white rounded-2xl p-4 shadow-xl space-y-2">

    {navLinks.map((link) => (
      <div key={link.name} className="border-b border-gray-100 pb-2">

        {/* BUTTON */}
        <button
          onClick={() =>
            setMobileDropdown(
              mobileDropdown === link.modal ? null : link.modal
            )
          }
          className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold text-gray-800 rounded-xl hover:bg-gray-50"
        >
          {link.name}
          {mobileDropdown === link.modal ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>

        {/* DROPDOWN CONTENT */}
        {mobileDropdown === link.modal && (
          <div className="mt-2 pl-2">

            {link.modal === "features" && (
              <Features isOpen={true} setOpen={() => {}} />
            )}

            {link.modal === "channels" && (
              <Chennals isOpen={true} setOpen={() => {}} />
            )}

            {link.modal === "madefor" && (
              <Madefor isOpen={true} setOpen={() => {}} />
            )}

            {link.modal === "resources" && (
              <Resources isOpen={true} setOpen={() => {}} />
            )}

          </div>
        )}
      </div>
    ))}

    {/* LOGIN BUTTON */}
    <Link
      to="/login"
      onClick={() => setMobileOpen(false)}
      className="block mt-4 text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
    >
      Log in
    </Link>
  </div>
)}
    </header>
  );
};

export default Header;