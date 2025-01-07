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
    let posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "name profilePic",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name profilePic",
        },
      });
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
const getFriendPosts = async (req, res) => {
  let id = req.params.id;
  try {
    let posts = await postModel.find({ userId: id });
    return res.json({
      message: "Post found successfully",
      success: true,
      posts,
    });
  } catch (error) {}
};

const postComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user;
    const postId = req.params.id;

    const postDetails = await postModel.findById(postId);

    postDetails.comments.push({ user: userId, text });
    await postDetails.save();
    return res.json({ message: "commented succesfully ", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

const likePost = async (req, res) => {
  try {
    const userId = req.user;
    const postId = req.params.id;
    const postData = await postModel.findById(postId);
    if (!postData.likes.includes(userId)) {
      postData.likes.push(userId);
      await postData.save();
      return res.json({ message: "post liked  ", success: true });
    } else {
      postData.likes.pull(userId);
      await postData.save();
      return res.json({ message: "post disliked  ", success: true });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    // const user = req.user;
    const post = await postModel.findById(postId);

    let filteredArr = post.comments.filter(
      (ele) => ele._id.toString() !== commentId
    );
    post.comments = filteredArr;
    await post.save();
    return res.json({ message: "delete successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getUserPosts,
  getFriendPosts,
  postComment,
  likePost,
  deleteComment,
};
