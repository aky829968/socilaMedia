import React from "react";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import Friends from "@/components/Friends";

const Home = () => {
  return (
    <div className="mt-0 flex  px-0 gap-16 md:px-4">
      <div className=" hidden md:block w-[20%] h-screen mt-0 text-center border-r-2 border-black">
        <Sidebar />
      </div>
      <div className=" w-[100%] md:w-[50%] example overflow-y-auto  h-screen">
        <Posts />
      </div>
      <div className=" hidden md:block border-l-2 ps-4 border-black">
        <Friends />
      </div>
    </div>
  );
};

export default Home;
