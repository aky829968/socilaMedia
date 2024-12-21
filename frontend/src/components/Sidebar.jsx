import React, { useContext, useState } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";
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
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "@/context/UserContext";
import { Loader2 } from "lucide-react";

const Sidebar = () => {
  let ctx = useContext(UserContext);
  const [input, setInput] = useState({
    title: "",
    description: "",
    file: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInputchange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
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
      setInput({});
    }
  };
  return (
    <div className=" w-[20%] h-screen mt-0 text-center px-6 border-r-2 border-black">
      <div className="flex gap-4 p-2 rounded-md hover:bg-gray-200  items-center ">
        <Dialog>
          <DialogTrigger>
            <div className="flex gap-4 px-2 py-1 rounded-md hover:bg-gray-200 w-full items-center ">
              <FaRegPlusSquare className="text-3xl" />

              <button className="text-lg font-semibold outline-none">
                Create Post
              </button>
            </div>
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
                    onChange={handleInputchange}
                    placeholder="title"
                  />
                  <textarea
                    className="px-4 py-2 rounded-md outline-none border-2 border-zinc-300"
                    name="description"
                    onChange={handleInputchange}
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
      </div>
    </div>
  );
};

export default Sidebar;
