const express = require("express");
const cors = require("cors");
const connectDb = require("./db");
const userModel = require("./models/userModel");
const app = express();
const axios = require("axios");

const userRouter = require("./routes/userRouts");
const postRouter = require("./routes/postRoutes");
const dotenv = require("dotenv");
dotenv.config();
const port = 8080;
connectDb();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
