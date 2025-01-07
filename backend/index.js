const express = require("express");
const cors = require("cors");
const connectDb = require("./db");
const userModel = require("./models/userModel");
const app = express();
const axios = require("axios");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const userRouter = require("./routes/userRouts");
const postRouter = require("./routes/postRoutes");
const messageRouter = require("./routes/messageRoutes");
const dotenv = require("dotenv");
dotenv.config();
const port = 8080;
connectDb();
corsOptions = {
  origin: "https://socila-media.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello world");
});

let users = new Map();

const addUsers = (userId, clientId) => {
  users.set(userId, clientId);
};

io.on("connection", (client) => {
  // console.log("Connected to socket");
  client.on("join", (id) => {
    console.log("joined", id, client.id);
    addUsers(id, client.id);
    // console.log(users);
  });
  client.on("sendMessage", ({ friendId, userId, message }) => {
    console.log(friendId, userId, message);
    // addUsers(friendId, client.id);
    let findUser = users.get(friendId);
    if (findUser) {
      client.to(findUser).emit("getMessage", { userId, friendId, message });
    }
  });
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/message", messageRouter);

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
