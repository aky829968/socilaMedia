const express = require("express");
const router = express.Router();

const {
  register,
  login,
  deleteUser,
  updateUser,
  forgotPassword,
  enterPassword,
  updatePassword,
  getProfile,
  getUsername,
  getFriendProfile,
  followUser,
  getFollowers,
} = require("../controllers/userController");
const authUser = require("../middleware/authmidlleware");

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", authUser, deleteUser);
router.get("/profile", authUser, getProfile);
router.put("/update", authUser, updateUser);
router.post("/forgot", forgotPassword);
router.get("/token/:resettoken", enterPassword);
router.post("/token/:resettoken", updatePassword);
router.get("/getuser", getUsername);
router.get("/getFriendProfile/:id", getFriendProfile);
router.post("/followuser/:id", authUser, followUser);
router.get("/followers", authUser, getFollowers);

module.exports = router;
