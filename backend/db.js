const mongoose = require("mongoose");

const connectDb = async () => {
  const data = await mongoose.connect(`${process.env.MONGO}`);
  if (data) {
    console.log("Connected database");
  }
};
module.exports = connectDb;
