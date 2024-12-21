// Import required hooks from React
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, Settings2, User2 } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ctx = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const getProfile = async () => {
    let res = await axios.get("http://localhost:8080/user/profile", {
      headers: {
        Authorization: ctx.userDetails.token,
      },
    });
    const data = res.data;
    // console.log(data);
    setUserData(data.user);
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <nav className=" bg-slate-300 px-6 py-4 shadow-md  fixed top-0 left-0 right-0  z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-800">
          <Link to="/">ConnectToAll</Link>
        </div>

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
          <Link
            to="/"
            className="text-gray-800 font-bold text-lg  hover:text-red-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-800 font-bold text-lg  hover:text-red-600 transition"
          >
            About
          </Link>
        </div>

        <div className="relative ">
          <img
            onClick={() => setMenu(!menu)}
            className="w-9 h-9 rounded-full cursor-pointer"
            src={userData.profilePic}
          />
          {menu && (
            <ul className=" transition-all ease-linear absolute right-0 px-2 w-max py-2  bg-slate-100 border-2  top-[120%] rounded-md">
              <div
                onClick={() => setMenu(!menu)}
                className="mt-1 px-2 rounded flex items-center gap-2  hover:bg-slate-200    w-[100%]  py-1"
              >
                <img
                  className="w-9 h-9 rounded-full cursor-pointer"
                  src={userData.profilePic}
                />
                <h2 className="font-medium text-md text-blue-700">
                  {userData.name}
                </h2>
              </div>
              <div
                onClick={() => setMenu(!menu)}
                className="mt-1 px-2 rounded flex gap-2  hover:bg-slate-200    w-[100%]  py-1"
              >
                <User2 className="text-xl" />
                <Link to="/profile">Profile</Link>
              </div>
              {ctx.userDetails.login && (
                <div
                  onClick={() => {
                    setMenu(!menu);
                    ctx.logout();
                  }}
                  className="mt-1 flex gap-2 hover:bg-slate-200  px-2 rounded   w-full  py-1"
                >
                  <LogOutIcon />
                  <Link>Logout</Link>
                </div>
              )}

              <div
                onClick={() => setMenu(!menu)}
                className="mt-1 flex gap-2 hover:bg-slate-200 px-2 rounded   w-full  py-1"
              >
                <Settings2 className="text-xl" />
                <Link to="/signup">Settings</Link>
              </div>
            </ul>
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
