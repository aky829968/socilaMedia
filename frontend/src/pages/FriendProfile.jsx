import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import axios from "axios";
import { Edit2, MessageCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MdFollowTheSigns } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const FriendProfile = () => {
  let location = useLocation();
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const { userDetails } = useContext(UserContext);
  const getProfile = async () => {
    let res = await axios.get(
      `https://socilamedia-1.onrender.com/user/getFriendProfile/${location.state}`
    );
    const data = res.data;
    // console.log(data);
    // setUserData(data.user);
    if (data.success) {
      setUserData(data.user);
    }
  };
  const getPosts = async () => {
    const res = await axios.get(
      `http://localhost:8080/post/getfriendpost/${location.state}`
    );

    const data = res.data;
    // console.log(data);
    setPosts(data.posts);
  };
  useEffect(() => {
    getPosts();
  }, [location.state]);
  useEffect(() => {
    getProfile();
  }, [location.state]);

  const handleFollow = async () => {
    const res = await axios.post(
      `http://localhost:8080/user/followuser/${location.state}`,
      {},
      {
        headers: {
          Authorization: userDetails.token,
        },
      }
    );

    const data = res.data;
    // console.log(data);
    // setPosts(data.posts);
    if (data.success) {
      toast.success(data.message);
      getProfile();
    }
  };

  return (
    <div className="w-[85%]  mx-auto ">
      <div className="h-[20vw] relative ">
        <img className="w-full h-full" src={userData.coverPic} />

        <div className="w-full h-56  -bottom-40  absolute left-[5%] ">
          <div className="flex items-center justify-center    ">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full h-36  w-40 flex items-center justify-center">
              <img
                className="w-32 h-32 rounded-full  border-white "
                src={userData.profilePic}
              />
            </div>

            <div className="flex h-32 items-center pt-8 w-full   justify-between px-6  mt-9">
              <div>
                <h2 className=" text-2xl font-bold font-serif text-blue-600">
                  {userData.name}
                </h2>
                <p>{userData.bio}</p>
                <div className="flex gap-10">
                  <div className="font-medium text-center">
                    Followers
                    <h2>{userData?.followers?.length}</h2>
                  </div>
                  <div className="font-medium text-center">
                    Following
                    <h2>{userData?.following?.length}</h2>
                  </div>
                  <Link
                    to="/chat"
                    state={userData}
                    className="font-medium flex gap-2 text-white  bg-purple-600 px-4 pt-2 rounded-md"
                  >
                    <MessageCircle /> Chat
                  </Link>
                </div>
              </div>
              <Button
                onClick={handleFollow}
                variant="outline"
                className="bg-blue-600 text-white mr-12 mt-8"
              >
                <MdFollowTheSigns />
                {userData?.followers?.includes(userDetails.userId)
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-40 border-gray-700   border-t-2">
        <h2 className="text-xl font-semibold text-red-500">All Posts</h2>
        <div className="flex flex-wrap  justify-center">
          {posts.length != 0 ? (
            posts?.map((ele) => {
              return (
                <div className="w-64 self-start       overflow-hidden bg-white  shadow-md dark:bg-gray-800">
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
            })
          ) : (
            <h2 className="text-xl">No Posts Yet</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
