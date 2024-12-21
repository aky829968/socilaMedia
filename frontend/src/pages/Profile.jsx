import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import axios from "axios";
import { Edit2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

const Profile = () => {
  const ctx = useContext(UserContext);
  const [userData, setUserData] = useState("");
  const [posts, setPosts] = useState([]);
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
  const getPosts = async () => {
    const res = await axios.get("http://localhost:8080/post/getuserpost", {
      headers: {
        Authorization: ctx.userDetails.token,
      },
    });
    const data = res.data;
    // console.log(data);
    setPosts(data.posts);
  };
  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="w-[85%]  mx-auto ">
      <div className="h-[20vw] relative ">
        <img className="w-full h-full" src={userData.coverPic} />
        <div className="w-full h-56 -bottom-40  absolute left-[5%] ">
          <div className="flex items-center  w-full">
            <img
              className="w-52 h-full rounded-full"
              src={userData.profilePic}
            />
            <div className="flex justify-between px-6 w-full mt-4">
              <div>
                <h2 className=" text-2xl font-bold font-serif text-blue-600">
                  {userData.name}
                </h2>
                <h2 className="font-medium">365 Followers</h2>
                <p>Because you are continuously repeating in my mind.</p>
              </div>
              <Button
                variant="outline"
                className="bg-blue-600 text-white mr-12"
              >
                <Edit2 />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-40 border-gray-700   border-t-2">
        <h2 className="text-xl font-semibold text-red-500">All Posts</h2>
        <div className="flex flex-wrap gap-6 px-20">
          {posts?.map((ele) => {
            return (
              <div className="w-64      overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                {ele?.file?.includes("image") ? (
                  <img
                    className="object-fit w-full h-64"
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
                <div className="p-2 ">
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
                  <div className="mt-1">
                    <div className="flex items-center">
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
    </div>
  );
};

export default Profile;
