import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import Navbar from "./components/Navbar";
import Forgot from "./pages/Forgot";
import Profile from "./pages/Profile";
import FriendProfile from "./pages/FriendProfile";
import Chat from "./pages/Chat";

function App() {
  const ctx = useContext(UserContext);
  console.log(ctx.userDetails);
  const login = ctx.userDetails.login;
  return (
    <>
      <BrowserRouter>
        <div className="mb-20">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={login ? <Home /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/searchProfile" element={<FriendProfile />} />
          <Route path="/chat" element={login ? <Chat /> : <Login />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
