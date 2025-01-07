import UserContext from "@/context/UserContext";
import axios from "axios";
import {
  Delete,
  DeleteIcon,
  Heart,
  HeartIcon,
  MessageCircleCodeIcon,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { FaComment, FaHeart } from "react-icons/fa";
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
import { MdDelete } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const Posts = () => {
  // const { userDetails } = useContext(UserContext);
  // const [ctx.posts, setctx.posts] = useState([]);
  const ctx = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  // const ctx.getAllctx.posts = ctx.ctx.getAllctx.posts;
  const getProfile = async () => {
    let res = await axios.get("https://socilamedia-1.onrender.com/user/profile", {
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
  // const ctx.getAllctx.posts = async () => {
  //   const res = await axios.get("http://localhost:8080/post/getallpost");
  //   const data = res.data;
  //   // console.log(data);
  //   if (data.success) {
  //     setctx.posts(data.ctx.posts);
  //     // console.log(data.ctx.posts);
  //   }
  // };
  const handleComment = async (id) => {
    const res = await axios.post(
      `https://socilamedia-1.onrender.com/post/comment/${id}`,
      {
        text: comment,
      },
      {
        headers: {
          Authorization: ctx.userDetails.token,
        },
      }
    );
    const data = res.data;
    if (data.success) {
      toast.success(data.message);
      setComment("");
    } else {
      console.log(data.message);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.get(`https://socilamedia-1.onrender.com/post/like/${id}`, {
        headers: {
          Authorization: ctx.userDetails.token,
        },
      });
      const data = res.data;
      if (data.success) {
        // setLike(!like);
        toast.success(data.message);
        ctx.getAllPosts();
      }
    } catch (error) {}
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      // console.log(postId, commentId);
      let res = await axios.delete(
        `https://socilamedia-1.onrender.com/post/deleteComment/${postId}/${commentId}`
      );
      const data = res.data;
      if (data.success) {
        toast.success(data.message);

        let arr = selectedPost?.comments.filter(
          (ele) => ele._id.toString() !== commentId.toString()
        );
        console.log(arr);
        let obj = { ...selectedPost };
        obj.comments = arr;
        setSelectedPost(obj);
        ctx.getAllPosts();
        console.log(selectedPost);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ctx.getAllPosts();
  }, [comment, like]);
  return (
    <div>
      <h2 className="font-bold">All Posts</h2>
      <div className="flex flex-col items-center gap-1">
        {ctx.posts.map((ele) => {
          return (
            <div className="max-w-1 min-w-96  overflow-hidden bg-slate-100 rounded-md shadow-md dark:bg-gray-800">
              <div className="mt-2 ms-6 flex ">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <img
                      className="object-cover h-10 w-10 rounded-full"
                      src={ele?.userId?.profilePic}
                      alt="Avatar"
                    />
                    <a
                      href="#"
                      className="mx-2 font-semibold text-gray-700 dark:text-gray-200"
                      tabIndex={0}
                      role="link"
                    >
                      {ele.userId.name}
                    </a>
                  </div>
                </div>
                <div className="flex items-center ">
                  <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                    {formatDistanceToNow(ele.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>

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
                  <div className="flex gap-4 w-[100%] items-center">
                    {ele.likes.includes(userData._id) ? (
                      <FaHeart
                        onClick={() => handleLike(ele._id)}
                        color="red"
                        size={25}
                        className="cursor-pointer     "
                      />
                    ) : (
                      <FaHeart
                        onClick={() => handleLike(ele._id)}
                        size={25}
                        className="cursor-pointer text-gray-300 "
                      />
                    )}
                    <h2 className="font-serif">{ele?.likes?.length} likes</h2>

                    <Dialog>
                      <DialogTrigger>
                        <FaComment
                          onClick={() => setSelectedPost(ele)}
                          size={25}
                          color=""
                          className="cursor-pointer text-red-400"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="mb-4">
                            All comments
                          </DialogTitle>
                          <DialogDescription>
                            <div className="">
                              {selectedPost?.comments?.length > 0 ? (
                                selectedPost?.comments?.map((com) => {
                                  return (
                                    <div className="flex gap-2 border rounded p-2 relative items-center my-2">
                                      <img
                                        className="w-7 h-7 rounded-full"
                                        src={com?.user?.profilePic}
                                      />
                                      <h2>{com.text}</h2>{" "}
                                      {userData._id.toString() ===
                                      com.user._id.toString() ? (
                                        <MdDelete
                                          onClick={() =>
                                            handleDeleteComment(
                                              ele._id,
                                              com._id
                                            )
                                          }
                                          className="absolute right-2 top-2 cursor-pointer"
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <h2 className="text-bold text-xl text-center">
                                  No Comments Found
                                </h2>
                              )}
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button className="bg-blue-600 w-max hover:bg-blue-800 px-8">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <h2 className=" font-serif">
                      {ele?.comments?.length} comments
                    </h2>
                  </div>
                  <div className="flex gap-2 mt-2 items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={userData?.profilePic}
                    />
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Post your comment"
                      className="border w-56 px-2 py-1 text-sm rounded outline-none"
                    />
                    <Button
                      onClick={() => handleComment(ele._id)}
                      className="bg-blue-600 font-semibold"
                    >
                      Post
                    </Button>
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
