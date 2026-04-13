import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Features from "../../Modals/Features";
import Channels from "../../Modals/Channels";
import Madefor from "../../Modals/Madefor";
import Resources from "../../Modals/Resources";

const navLinks = [
  { name: "Features",  modal: "features"  },
  { name: "Channels",  modal: "channels"  },
  { name: "Made for",  modal: "madefor"   },
  { name: "Resources", modal: "resources" },
];

const DropdownContent = ({ modal }) => {
  if (modal === "features")  return <Features />;
  if (modal === "channels")  return <Channels />;
  if (modal === "madefor")   return <Madefor />;
  if (modal === "resources") return <Resources />;
  return null;
};

const Header = () => {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeModal,  setActiveModal]  = useState(null);
  const [mobilePanel,  setMobilePanel]  = useState(null);
  const headerRef = useRef(null);

  /* close desktop dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveModal(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDesktop = (modal) =>
    setActiveModal((prev) => (prev === modal ? null : modal));

  const toggleMobile = (modal) =>
    setMobilePanel((prev) => (prev === modal ? null : modal));

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full backdrop-blur-md "
    >
      {/* ── Top bar ── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        
        <Link
          to="/"
          className="mr-auto text-xl font-bold tracking-tight text-gray-900 shrink-0"
        >
        <span className="text-[20px] font-bold leading-[56px] text-blue-600">S</span>
        chedly.
        </Link>

        {/* Desktop nav pill */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                onClick={() => toggleDesktop(link.modal)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeModal === link.modal
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {link.name}
                {activeModal === link.modal
                  ? <IoIosArrowUp  size={14} />
                  : <IoIosArrowDown size={14} />}
              </button>

              {/* Dropdown panel */}
              {activeModal === link.modal && (
                <div className="absolute left-1/2 top-full mt-3 z-50 -translate-x-1/2">
                  <DropdownContent modal={link.modal} />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex ml-auto items-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            Log in
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle menu"
          onClick={() => { setMobileOpen(!mobileOpen); setMobilePanel(null); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            }
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="px-4 py-3 space-y-1">

            {navLinks.map((link) => (
              <div key={link.name}>
                <button
                  onClick={() => toggleMobile(link.modal)}
                  className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                >
                  {link.name}
                  {mobilePanel === link.modal
                    ? <IoIosArrowUp  size={16} />
                    : <IoIosArrowDown size={16} />}
                </button>

                {/* Accordion panel — strip the card shadow since it's inline */}
                {mobilePanel === link.modal && (
                  <div className="px-2 pb-2">
                    <DropdownContent modal={link.modal} />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 pb-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;