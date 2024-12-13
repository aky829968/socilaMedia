// Import required hooks from React
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ctx = useContext(UserContext);

  return (
    <nav className="bg-gradient-to-r from-red-400 to-sky-500 px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">MyApp</div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a
            href="#home"
            className="text-gray-800 font-bold text-lg  hover:text-red-600 transition"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-800 font-bold text-lg  hover:text-red-600 transition"
          >
            About
          </a>
          {ctx.userDetails.login && (
            <button
              onClick={ctx.logout}
              className="text-gray-800 font-bold text-lg  hover:text-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <a
            href="#home"
            className="block text-gray-800 hover:text-gray-600 transition"
          >
            Home
          </a>
          <a
            href="#about"
            className="block text-gray-800 hover:text-gray-600 transition"
          >
            About
          </a>
          {ctx.userDetails.login && (
            <button
              onClick={ctx.logout}
              className="text-gray-800 hover:text-gray-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
