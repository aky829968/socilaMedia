import UserContext from "@/context/UserContext";
import UserState from "@/context/UserState";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Friends = () => {
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const getFollowers = async () => {
    try {
      let res = await axios.get(`http://localhost:8080/user/followers`, {
        headers: {
          authorization: ctx.userDetails.token,
        },
      });
      let data = res.data;
      if (data.success) {
        console.log(data.followers);
        setFollowers(data.followers);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFollowers();
  }, []);
  return (
    <div>
      <h2 className="font-bold text-xl my-2 font-serif">Followers</h2>
      <div>
        {followers?.map((ele) => {
          return (
            <Link
              state={ele._id}
              to="/searchProfile"
              className="flex gap-3 items-center border-b-2"
            >
              <img src={ele.profilePic} className="w-12 h-12 rounded-full" />
              <h2 className="font-serif font-semibold">{ele.name}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;
