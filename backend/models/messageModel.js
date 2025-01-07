const mongoose = require("mongoose");

const messageModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
  },
},{timestamps:true});
module.exports = mongoose.model("message", messageModel);
