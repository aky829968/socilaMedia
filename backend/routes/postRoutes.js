const express = require("express");
const {
  updatePost,
  createPost,
  deletePost,
  getAllPost,
  getUserPosts,
  getFriendPosts,
  postComment,
  likePost,
  deleteComment,
} = require("../controllers/postController");
const authUser = require("../middleware/authmidlleware");
const router = express.Router();

router.post("/create", authUser, createPost);
router.put("/update/:_id", updatePost);
router.delete("/delete/:_id", deletePost);
router.get("/getallpost", getAllPost);
router.get("/getuserpost", authUser, getUserPosts);
router.get("/getfriendpost/:id", getFriendPosts);
router.post("/comment/:id", authUser, postComment);
router.get("/like/:id", authUser, likePost);
router.delete("/deleteComment/:postId/:commentId", deleteComment);

module.exports = router;
