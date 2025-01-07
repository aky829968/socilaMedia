import UserContext from "@/context/UserContext";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { use } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import { formatDistanceToNow } from "date-fns";

const Chat = () => {
  let EndPoint = "https://socilamedia-1.onrender.com";
  let socketRef = useRef("");
  const location = useLocation();
  const { userDetails } = useContext(UserContext);
  const friendId = location.state._id;
  const [chat, setChat] = useState([]);
  const inputRef = useRef(null);
  const sendMessage = async () => {
    // socket.emit(())
    socketRef.current.emit("sendMessage", {
      friendId,
      userId: userDetails?.userId,
      message: inputRef.current.value,
    });
    const res = await axios.post(
      `https://socilamedia-1.onrender.com/message/sendmessage/${location.state._id}`,
      { text: inputRef.current.value },
      {
        headers: {
          Authorization: userDetails.token,
        },
      }
    );
    const data = res.data;
    if (data.success) {
      console.log(data);
      inputRef.current.value = "";
      getchat();
    }
  };
  const getchat = async () => {
    const res = await axios.get(
      `https://socilamedia-1.onrender.com/message/getchat/${location.state._id}`,
      {
        headers: {
          Authorization: userDetails.token,
        },
      }
    );
    const data = res.data;
    if (data.success) {
      console.log(data);
      setChat(data.chat);
    }
  };
  useEffect(() => {
    getchat();
  }, []);
  useEffect(() => {
    socketRef.current = io(EndPoint, { transports: ["websocket"] });
    socketRef.current.emit("join", userDetails?.userId);
  }, []);

  const [newMessages, setNewMessages] = useState({});

  useEffect(() => {
    socketRef.current.on("getMessage", ({ userId, friendId, message }) => {
      setNewMessages({
        userId,
        friendId,
        text: message,
        createdAt: Date.now(),
      });
    });
  }, [sendMessage]);

  useEffect(() => {
    if (newMessages) {
      setChat([...chat, newMessages]);
    }
  }, [newMessages]);

  return (
    <>
      <ScrollToBottom className="flex-1  sm:p-6 justify-between flex flex-col h-[480px] ">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"></div>
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {chat.map((message) =>
            message.userId === friendId ? (
              <div className="chat-message">
                <div className="flex items-center">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                        {message.text}
                      </span>
                      <p>
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <img
                    src={location.state.profilePic}
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-1"
                  />
                </div>
              </div>
            ) : (
              <div className="chat-message">
                <div className="flex items-center justify-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        {message.text}
                      </span>
                      <p>
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <img
                    src={userDetails.user.profilePic}
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-2"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </ScrollToBottom>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={sendMessage}
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 ml-2 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
