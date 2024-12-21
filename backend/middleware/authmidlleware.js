const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({
  //     message: "Authorization token missing or invalid",
  //     success: false,
  //   });
  // }

  // Extract the token
  const token = authHeader;

  if (!token) {
    return res.status(400).json({ message: "Token is not he", success: false });
  }
  let user = jwt.verify(token, process.env.SECRET_KEY);

  if (!user) {
    res.status(400).json({ message: "Token not found", success: false });
  }
  req.user = user._id;

  next();
};

module.exports = authUser;
