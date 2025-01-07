const express = require("express");
const authUser = require("../middleware/authmidlleware");
const { sendMessage, getChat } = require("../controllers/messageController");
const router = express.Router();

router.post("/sendmessage/:id", authUser, sendMessage);
router.get("/getChat/:id", authUser, getChat);

module.exports = router;
