import axios from "axios";
import React, { useState } from "react";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    const ans = {
      email: email,
    };
    const res = await axios.post("http://localhost:8080/user/forgot", ans);
    // console.log((await res).data.message);
    if ((await res).data.success) {
      toast.success("Check your Email for reset password", {
        position: "top-right",
        autoClose: 1000,
      });
    } else {
      toast.error("Enter correct email", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center  h-screen gap-6">
      <div className=" mt-32 flex flex-col gap-6 border-2 rounded-lg bg-purple-300 p-6 ">
        <h5 className=" text-lg md:text-2xl font-semibold">
          Enter your Email for reset your password
        </h5>

        <input
          className="bg-gray-400 px-6 py-2 rounded text-white  placeholder:text-white"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <button
          className="bg-green-500  px-6 w-[50%] font-semibold  py-2 rounded-md"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Forgot;
