import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  approvePost,
  bookmarkPost,
  create,
  deletePost,
  getBookmarkedPosts,
  getMyPosts,
  getPendingPostById,
  getPendingPosts,
  getPostsController,
  likePost,
  rejectPost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getposts", getPostsController);

router.get("/getmyposts", getMyPosts);

router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

router.put("/updatepost/:postId/:userId", verifyToken, updatePost);

// Route để admin/censor phê duyệt bài viết
router.put("/approve/:postId", verifyToken, approvePost);

// Route để admin/censor từ chối bài viết
router.put("/reject/:postId", verifyToken, rejectPost);

router.get("/getpendingposts", verifyToken, getPendingPosts);

router.get("/pending/:postId", getPendingPostById);

router.put("/like/:postId", verifyToken, likePost);

router.put("/bookmark/:postId", verifyToken, bookmarkPost);

router.get("/getbookmarkedposts", verifyToken, getBookmarkedPosts);

export default router;
