import UserContext from "@/context/UserContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Posts = () => {
  // const { userDetails } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
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
  const getAllPosts = async () => {
    const res = await axios.get("http://localhost:8080/post/getallpost");
    const data = res.data;
    // console.log(data);
    if (data.success) {
      setPosts(data.posts);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className=" w-[80%] example overflow-y-auto  h-screen">
      <h2>All posts</h2>
      <div className="flex flex-col items-center gap-4">
        {posts.map((ele) => {
          return (
            <div className="max-w-md min-w-96  overflow-hidden bg-slate-300 rounded-md shadow-md dark:bg-gray-800">
              {ele?.file?.includes("image") ? (
                <img
                  className="object-fit w-full h-96"
                  src={ele.file}
                  alt="Article"
                />
              ) : ele?.file?.includes("video") ? (
                <video
                  className="object-fit w-full h-96"
                  src={ele.file}
                  alt="Article"
                />
              ) : (
                ""
              )}
              <div className="px-6  py-2 ">
                <div>
                  <h2
                    className="block  text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline"
                    tabIndex={0}
                    role="link"
                  >
                    {ele?.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {ele?.description}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <img
                        className="object-cover h-10 rounded-full"
                        src={userData?.profilePic}
                        alt="Avatar"
                      />
                      <a
                        href="#"
                        className="mx-2 font-semibold text-gray-700 dark:text-gray-200"
                        tabIndex={0}
                        role="link"
                      >
                        {/* {userDetails.nma} */}
                      </a>
                    </div>
                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                      21 SEP 2015
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
