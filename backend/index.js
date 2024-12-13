const express = require("express");
const cors = require("cors");
const connectDb = require("./db");
const userModel = require("./models/userModel");
const app = express();
const userRouter = require("./routes/userRouts");
const dotenv = require("dotenv");
dotenv.config();
const port = 8080;
connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
