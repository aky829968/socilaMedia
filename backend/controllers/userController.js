const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  const { name, email, password } = await req.body;
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
      res.json({ message: "User Not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ message: "password not matched", success: false });
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
    const { name, password } = req.body;

    if (password) {
      var hashedPassword = await bcrypt.hash(password, 10);
    }

    await userModel.findByIdAndUpdate(_id, {
      name: name,
      password: hashedPassword,
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

module.exports = {
  register,
  login,
  deleteUser,
  updateUser,
  forgotPassword,
  enterPassword,
  updatePassword,
  getProfile,
};
