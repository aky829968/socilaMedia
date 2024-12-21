const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [4, "Password should be more than 4 characters"],
  },
});

userSchema.add({
  resetToken: {
    type: String,
    default: null,
  },
  profilePic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7U_ef87Q7CQ1Fx_khkPq-y9IfPmBWrMZ6ig&s",
  },
  coverPic: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  bio: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
