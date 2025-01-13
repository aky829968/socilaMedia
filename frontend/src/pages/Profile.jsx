import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserContext from "@/context/UserContext";
import axios from "axios";
import { CameraIcon, Edit2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const [loading, setLoading] = useState(false);

  const ctx = useContext(UserContext);
  const [userData, setUserData] = useState("");
  const [updatedData, setUpdatedData] = useState({
    name: "",
    password: "",
    bio: "",
  });
  const [posts, setPosts] = useState([]);

  const getProfile = async () => {
    let res = await axios.get(
      "https://socilamedia-1.onrender.com/user/profile",
      {
        headers: {
          Authorization: ctx.userDetails.token,
        },
      }
    );
    const data = res.data;
    // console.log(data);
    setUserData(data.user);
  };
  const getPosts = async () => {
    const res = await axios.get(
      "https://socilamedia-1.onrender.com/post/getuserpost",
      {
        headers: {
          Authorization: ctx.userDetails.token,
        },
      }
    );
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

  const handleProfileChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "social");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dydpnne8n/upload",
        formdata
      );
      let data = await res.data;

      try {
        const res1 = await axios.put(
          "https://socilamedia-1.onrender.com/user/update",
          { profilePic: data.secure_url },
          {
            headers: {
              Authorization: ctx.userDetails.token,
            },
          }
        );
        const ans = res1.data;
        if (ans.success) {
          console.log("ddlfkl");
          toast.success(ans.message);
          getProfile();
        }
      } catch (error) {}
    }
  };
  const handleCoverChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "social");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dydpnne8n/upload",
        formdata
      );
      let data = await res.data;

      try {
        const res1 = await axios.put(
          "https://socilamedia-1.onrender.com/user/update",
          { coverPic: data.secure_url },
          {
            headers: {
              Authorization: ctx.userDetails.token,
            },
          }
        );
        const ans = res1.data;
        if (ans.success) {
          console.log("ddlfkl");
          toast.success(ans.message);
          getProfile();
        }
      } catch (error) {}
    }
  };
  const handleInputchange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    console.log(updatedData);
    try {
      const res1 = await axios.put(
        "https://socilamedia-1.onrender.com/user/update",
        updatedData,
        {
          headers: {
            Authorization: ctx.userDetails.token,
          },
        }
      );
      const ans = res1.data;
      if (ans.success) {
        // console.log("ddlfkl");
        toast.success(ans.message);
        getProfile();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" w-[95%] md:w-[85%]  mx-auto ">
      <div className="h-[20vw] relative ">
        <img className="w-full h-full" src={userData.coverPic} />
        <label
          className="absolute top-4 left-4 bg-transparent  rounded-full p-1 cursor-pointer"
          htmlFor="cover"
        >
          <CameraIcon size={25} />
        </label>
        <input
          onChange={handleCoverChange}
          type="file"
          accept="image/*"
          hidden
          id="cover"
        />

        <div className="w-full h-max md:-bottom-40 md:top-32   absolute  top-20 md:left-[5%] ">
          <div className="flex flex-row-reverse   md:flex md:flex-row items-center    ">
            <div className="   h-40  w-40 ">
              <img
                className="w-32 h-32 rounded-full  border-white "
                // src={userData.profilePic}
                src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
              />
            </div>
            <label
              className="absolute top-4 left-[70%] md:top-4 md:left-4 bg-transparent  rounded-full p-1 cursor-pointer"
              htmlFor="profile"
            >
              <CameraIcon size={25} />
            </label>
            <input
              onChange={handleProfileChange}
              type="file"
              accept="image/*"
              hidden
              id="profile"
            />

            <div className="md:flex h-32 md:items-baseline md:justify-between px-6 w-full ">
              <div>
                <h2 className=" text-2xl font-bold font-serif text-blue-600">
                  {/* {userData.name} */}
                  Aditya Kuamr
                </h2>
                <p>{/* {userData.bio} */}I am a fullstack developer</p>
                <div className="flex gap-10">
                  <div className="font-medium text-center">
                    Followers
                    <h2>
                      {/* {userData?.followers?.length} */}
                      97
                    </h2>
                  </div>
                  <div className="font-medium text-center">
                    Following
                    <h2>{userData?.following?.length}</h2>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="outline"
                    className="bg-blue-600 text-white md:mr-12 md:mt-8"
                  >
                    <Edit2 />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-4">
                      Update Your Profile
                    </DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col gap-4 ">
                        <input
                          className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                          type="text"
                          name="name"
                          onChange={handleInputchange}
                          placeholder="Name"
                        />
                        <textarea
                          className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                          type="text"
                          name="bio"
                          onChange={handleInputchange}
                          placeholder="Bio"
                        />
                        <input
                          className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                          type="password"
                          name="password"
                          onChange={handleInputchange}
                          placeholder="Password"
                        />
                      </div>
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
                          Update
                        </Button>
                      )}
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-44 border-gray-700   border-t-2">
        <h2 className="text-xl font-semibold text-red-500">All Posts</h2>
        <div className=" flex flex-col  md:flex md:flex-row md:flex-wrap  justify-center">
          {posts?.map((ele) => {
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
                    {/* <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {ele?.description}
                    </p> */}
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                        {formatDistanceToNow(ele.createdAt, {
                          addSuffix: true,
                        })}
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
