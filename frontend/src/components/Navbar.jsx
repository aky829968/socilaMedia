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
import { Loader2, LogOutIcon, Search, Settings2, User2 } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MdDriveFolderUpload } from "react-icons/md";
import { FaRegPlusSquare } from "react-icons/fa";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ctx = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [searchUsers, setSearchUsers] = useState([]);
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

  const handleInputchange = async (e) => {
    try {
      let res = await axios.get(
        `http://localhost:8080/user/getuser?q=${e.target.value}`
      );
      let data = res.data;
      if (data.success) {
        // console.log(data.users);
        setSearchUsers(data.users);
      }
    } catch (error) {}
  };

  const [input, setInput] = useState({
    title: "",
    description: "",
    file: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  //
  const handleFilechange = async (e) => {
    setLoading(true);
    let file = e.target.files[0];
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   setInput({ ...input, file: reader.result });
    // };
    // reader.onerror = () => {
    //   console.log(reader.error);
    // };
    console.log(file);

    let formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "social");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dydpnne8n/upload",
      formdata
    );
    let data = await res.data;
    console.log(formdata);
    console.log(data);
    setLoading(false);
    setInput({ ...input, file: data.secure_url });
  };
  const handleSubmit = async () => {
    console.log(input);
    let res = await axios.post("http://localhost:8080/post/create", input, {
      headers: {
        Authorization: ctx.userDetails.token,
      },
    });
    let data = res.data;
    if (data.success) {
      toast.success(data.message, { autoClose: 1000 });
      ctx.getAllPosts();
      setInput({});
    }
  };

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
        <div className="hidden md:flex space-x-6 items-center">
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
          <Dialog>
            <DialogTrigger>
              <Search className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-4">Search New Friend</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-4 ">
                    <input
                      className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                      type="text"
                      name=""
                      onChange={handleInputchange}
                      placeholder="Search new friends"
                    />
                    <ul>
                      {searchUsers.map((ele) => {
                        return (
                          ele._id !== userData._id && (
                            <DialogClose asChild>
                              <Link state={ele._id} to="/searchProfile">
                                <li className="flex gap-2 items-center">
                                  <img
                                    className="w-10 h-10 rounded-full "
                                    src={ele.profilePic}
                                  />
                                  <h2>{ele.name}</h2>
                                </li>
                              </Link>
                            </DialogClose>
                          )
                        );
                      })}
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start"></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative ">
          <img
            onClick={() => setMenu(!menu)}
            className="w-9 h-9 rounded-full cursor-pointer"
            src={userData.profilePic}
          />
          {menu && (
            <ul className=" transition-all ease-linear absolute right-0 px-2 w-44 py-2  bg-slate-100 border-2  top-[120%] rounded-md">
              <div
                onClick={() => setMenu(!menu)}
                className="mt-1 px-2 rounded flex items-center gap-2  hover:bg-slate-200      py-1"
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
          <Link
            to="/"
            className="block text-gray-800 hover:text-gray-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-800 hover:text-gray-600 transition"
          >
            About
          </Link>
          <Dialog>
            <DialogTrigger className=" ">
              <button className="text-gray-800 block hover:text-gray-600 transition">
                Create Post
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-4">Create New Post</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-4 ">
                    <input
                      className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                      type="text"
                      name="title"
                      onChange={handleInput}
                      placeholder="title"
                    />
                    <textarea
                      className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                      name="description"
                      onChange={handleInput}
                      placeholder="Description"
                    ></textarea>
                    <label htmlFor="file">
                      <MdDriveFolderUpload className="text-3xl" />
                      <h2>Image/Video</h2>
                    </label>
                    <input
                      onChange={handleFilechange}
                      type="file"
                      name="file"
                      hidden
                      id="file"
                    />
                  </div>
                  {input?.file && (
                    <div className="w-1/2  ">
                      {input.file.includes("image") ? (
                        <img
                          className="h-44 w-full object-fit"
                          src={input.file}
                        />
                      ) : (
                        <video src={input.file} controls />
                      )}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  {loading ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-blue-600 w-max hover:bg-blue-800 px-8"
                    >
                      <Loader2 className="animate-spin" />
                      Loading
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-blue-600 w-max hover:bg-blue-800 px-8"
                    >
                      Create
                    </Button>
                  )}
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {ctx.userDetails.login && (
            <button
              onClick={ctx.logout}
              className="text-gray-800 block hover:text-gray-600 transition"
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
