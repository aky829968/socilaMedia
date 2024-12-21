import React from "react";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";

const Home = () => {
  return (
    <div className="mt-0 flex  gap-16 px-8">
      <Sidebar />
      <Posts />
    </div>
  );
};

export default Home;
