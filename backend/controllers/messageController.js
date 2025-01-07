const messageModel = require("../models/messageModel");
const conversationModel = require("../models/conversation");

const sendMessage = async (req, res) => {
  const friendId = req.params.id;
  const userId = req.user;
  const { text } = req.body;
  try {
    const message = await messageModel.create({
      friendId,
      userId,
      text,
    });
    let conversation = await conversationModel.findOne({
      users: { $all: [userId, friendId] },
    });
    if (!conversation) {
      conversationModel.create({ users: [userId, friendId] });
    }
    conversation.messages.push(message._id);
    await conversation.save();
    return res.json({ message: "send successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

const getChat = async (req, res) => {
  try {
    const userId = req.user;
    const friendId = req.params.id;

    const chat = await conversationModel
      .findOne({
        users: { $all: [userId, friendId] },
      })
      .populate("messages");

    return res.json({
      message: "chat get successfuly",
      success: true,
      chat: chat.messages,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

module.exports = { sendMessage, getChat };
