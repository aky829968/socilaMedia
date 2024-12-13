const mongoose = require("mongoose");

const connectDb = async () => {
  const data = await mongoose.connect("mongodb://localhost:27017/social");
  if (data) {
    console.log("Connected database");
  }
};
module.exports = connectDb;
