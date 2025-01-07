import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserState = (props) => {
  const user = JSON.parse(localStorage.getItem("socialUser"));
  const [userDetails, setUserDetails] = useState({
    login: user ? user.login : false,
    token: user ? user.token : "",
    userId: user ? user.userId : "",
    user: "",
  });
  const [posts, setPosts] = useState([]);
  const getAllPosts = async () => {
    const res = await axios.get(
      "https://socilamedia-1.onrender.com/post/getallpost"
    );
    const data = res.data;
    // console.log(data);
    if (data.success) {
      setPosts(data.posts);
    }
  };
  const getProfile = async () => {
    let res = await axios.get(
      "https://socilamedia-1.onrender.com/user/profile",
      {
        headers: {
          Authorization: userDetails.token,
        },
      }
    );
    const data = res.data;
    console.log(data);
    setUserDetails({ ...userDetails, user: data.user });
  };
  useEffect(() => {
    if (userDetails.token) {
      getProfile();
    }
  }, [userDetails.token]);

  const addUserTo = (token) => {
    const decoded = jwtDecode(token);

    localStorage.setItem(
      "socialUser",
      JSON.stringify({ login: true, token: token, userId: decoded._id })
    );
    // getAllPosts();
    setUserDetails({ login: true, token: token, userId: decoded._id });
  };

  const logout = () => {
    localStorage.removeItem("socialUser");
    setUserDetails({ login: false, token: "", userId: "" });
  };

  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        getProfile,
        addUserTo,
        logout,
        posts,
        getAllPosts,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
