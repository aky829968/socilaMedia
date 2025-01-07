const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  const { name, email, password, file } = await req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.json({ success: false, message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      profilePic: file,
    });

    return res
      .status(200)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "User Not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "password not matched", success: false });
    }
    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    return res
      .status(200)
      .json({ message: "Login Successfully", success: true, token });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  let id = req.user;
  try {
    await userModel.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const updateUser = async (req, res) => {
  let _id = req.user;

  try {
    const { name, password, profilePic, coverPic, bio } = req.body;

    if (password) {
      var hashedPassword = await bcrypt.hash(password, 10);
    }

    await userModel.findByIdAndUpdate(_id, {
      name: name,
      password: hashedPassword,
      profilePic,
      coverPic,
      bio,
    });

    return res
      .status(200)
      .json({ message: "Updated Successfully", success: true });
  } catch (error) {
    res.json({ error: error.message, success: false });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email not found", success: false });
  }
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      console.log("find user");
      let resetToken = randomstring.generate(30);
      user.resetToken = resetToken;
      await user.save();

      const mail = await forget(email, resetToken);
      res.json({ message: "Email send successfully", success: true });
    }
  } catch (error) {
    res.json({ message: error.message, success: true });
  }
};
function forget(email, resetToken) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "adityakumar262003@gmail.com",
      pass: "kanr nahe xknu fcom",
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '" 🙌✌SocialConnect" <adityakumar262003@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Password🤦‍♂️", // Subject line
      text: `Please click below link to reset your password \n "http://localhost:8080/user/token/${resetToken}"`, // plain text body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
}
const enterPassword = async (req, res) => {
  let token = req.params.resettoken;
  const user = await userModel.findOne({ resetToken: token });
  if (user) {
    res.render("resetPassword.ejs", { token });
  }
};

const updatePassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.resettoken;

  const user = await userModel.findOne({ resetToken: token });
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();
    res.json({ message: "User password updated successfull", success: true });
  } else {
    res.json({ message: "Something gone wrong", success: flase });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user;
    const user = await userModel.findById(userId);
    return res
      .status(200)
      .json({ message: "Profile get successfully", success: true, user });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

const getUsername = async (req, res) => {
  let query = req.query.q;
  let name = RegExp(query);
  let users = await userModel.find({ name: name });
  if (req.query.q) {
    return res.json({
      message: "User found successfully",
      success: true,
      users,
    });
  } else {
    res.json({ users: [] });
  }
};

const getFriendProfile = async (req, res) => {
  let id = req.params.id;
  try {
    let user = await userModel.findById(id).select("-password -email");
    return res.json({
      message: "user found successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const followUser = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user;

    const userDetails = await userModel.findById(userId);
    const friendDetails = await userModel.findById(friendId);
    // console.log(userId);
    if (!friendDetails.followers.includes(userId)) {
      // console.log(userDetails);
      // console.log(friendDetails);

      friendDetails.followers.push(userId);
      userDetails.following.push(friendId);
      await userDetails.save();
      await friendDetails.save();
      return res.json({ message: "user followed successfully", success: true });
    } else {
      friendDetails.followers.pull(userId);
      userDetails.following.pull(friendId);
      await userDetails.save();
      await friendDetails.save();
      return res.json({
        message: "user unfollowed successfully",
        success: true,
      });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.user;

    const userData = await userModel.findById(userId).populate({
      path: "followers",
    });
    const followers = userData.followers;

    return res.json({ message: "followers", success: true, followers });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

module.exports = {
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
};
