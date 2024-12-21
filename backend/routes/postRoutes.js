const express = require("express");
const {
  updatePost,
  createPost,
  deletePost,
  getAllPost,
  getUserPosts,
} = require("../controllers/postController");
const authUser = require("../middleware/authmidlleware");
const router = express.Router();

router.post("/create", authUser, createPost);
router.put("/update/:_id", updatePost);
router.delete("/delete/:_id", deletePost);
router.get("/getallpost", getAllPost);
router.get("/getuserpost", authUser, getUserPosts);

module.exports = router;
