const postModel = require("../models/postModel");

const createPost = async (req, res) => {
  const { title, description, file } = req.body;

  const userId = req.user;
  try {
    const data = await postModel.create({
      title,
      description,
      file,
      userId,
    });
    res.json({ message: "post created successfully", success: true });
  } catch (error) {
    res.json({ error: error.message, success: false });
  }
};
const updatePost = async (req, res) => {
  res.send("update working");
};
const deletePost = async (req, res) => {
  res.send("delete working");
};
const getAllPost = async (req, res) => {
  // res.send("get working");
  try {
    let posts = await postModel.find();
    res.json({ message: "posts get successfully", success: true, posts });
  } catch (error) {
    res.json({ error: error.message, success: false });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.user;
    const posts = await postModel.find({ userId });
    return res
      .status(200)
      .json({ message: "post get successfully", success: true, posts });
  } catch (error) {
    res.json({ error: error.message, success: false });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getUserPosts,
};
