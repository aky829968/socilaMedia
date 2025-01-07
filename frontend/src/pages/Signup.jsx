import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    file: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    // console.log(name);
    // console.log(value);
    setUserData({ ...userData, [name]: value });
  };

  const handleFilechange = async (e) => {
    setLoading(true);
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "social");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dydpnne8n/upload",
      formdata
    );
    let data = await res.data;
    setLoading(false);
    setUserData({ ...userData, file: data.secure_url });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);
    const response = await axios.post(
      "http://localhost:8080/user/register",
      userData
    );
    // const data = response.data;
    //    console.log(data.success);
    if (response.data.success) {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      navigate("/login");
    } else {
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 1000,
      });
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="  flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1640441710600-c2464f89f9a0?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          }}
        />
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
            Welcome to Our App!
          </p>
          <div className="">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              htmlFor="LoggingEmailAddress"
            >
              Name
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              name="name"
              id="name"
              placeholder="john cena"
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              htmlFor="LoggingEmailAddress"
            >
              Email Address
            </label>
            <input
              name="email"
              onChange={handleInputChange}
              id="LoggingEmailAddress"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                htmlFor="loggingPassword"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
              >
                Forget Password?
              </a>
            </div>
            <input
              name="password"
              onChange={handleInputChange}
              id="loggingPassword"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
            />
          </div>
          <div className="mt-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              htmlFor="LoggingEmailAddress"
            >
              Profile Pic
            </label>
            <input
              name="file"
              accept="image/*"
              onChange={handleFilechange}
              id="LoggingEmailAddress"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              type="file"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              {loading ? "Loading...." : "Sign Up"}
            </button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
            <Link
              to="/login"
              className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              or Login
            </Link>
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Signup;
