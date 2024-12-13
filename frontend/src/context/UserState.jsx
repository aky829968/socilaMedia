import React, { useState } from "react";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";

const UserState = (props) => {
  const user = JSON.parse(localStorage.getItem("socialUser"));
  const [userDetails, setUserDetails] = useState({
    login: user ? user.login : false,
    token: user ? user.token : "",
    userId: user ? user.userId : "",
  });

  const addUserTo = (token) => {
    const decoded = jwtDecode(token);

    localStorage.setItem(
      "socialUser",
      JSON.stringify({ login: true, token: token, userId: decoded._id })
    );
    setUserDetails({ login: true, token: token, userId: decoded._id });
  };

  const logout = () => {
    localStorage.removeItem("socialUser");
    setUserDetails({ login: false, token: "", userId: "" });
  };

  return (
    <UserContext.Provider
      value={{ userDetails, setUserDetails, addUserTo, logout }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
