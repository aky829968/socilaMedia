const express = require("express");
const router = express.Router();

const {
  register,
  login,
  deleteUser,
  updateUser,
  forgotPassword,
} = require("../controllers/userController");
const authUser = require("../middleware/authmidlleware");

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", authUser, deleteUser);
router.put("/update", authUser, updateUser);
router.post("/forgot", forgotPassword);

module.exports = router;
