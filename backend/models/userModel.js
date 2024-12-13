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
});

const user = mongoose.model("user", userSchema);
module.exports = user;
