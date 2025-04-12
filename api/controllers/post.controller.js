import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";
import { createPost, getPosts } from "../services/post.service.js";

export const create = async (req, res, next) => {
  try {
    const savedPost = await createPost(req.body, req.user);
    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsController = async (req, res, next) => {
  try {
    const result = await getPosts(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Lấy userId từ query
    const userId = req.query.userId; // Giả sử bạn sẽ gửi userId trong query

    // Lấy các bài viết của userId
    const posts = await Post.find({
      ...(userId && { userId }), // Lọc theo userId được gửi từ client
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      ...(userId && { userId }), // Tính tổng số bài viết của người dùng
    });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      ...(userId && { userId }), // Đếm số bài viết của người dùng trong tháng vừa qua
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    // Xóa tất cả các comment có postId trùng với postId của bài viết
    await Comment.deleteMany({ postId: req.params.postId });

    // Sau đó xóa bài viết
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json("The post and its comments have been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          document: req.body.document,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const approvePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    post.status = "approved";
    await post.save();

    res.status(200).json({ message: "Post has been approved" });
  } catch (error) {
    next(error);
  }
};

export const rejectPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    post.status = "rejected";
    await post.save();

    res.status(200).json({ message: "Post has been rejected" });
  } catch (error) {
    next(error);
  }
};

export const getPendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "pending" }).sort({
      updatedAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPendingPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      status: "pending", // Kiểm tra trạng thái là "pending"
    });

    if (!post) {
      return next(errorHandler(404, "Pending post not found")); // Nếu không tìm thấy bài viết
    }

    res.status(200).json(post); // Trả về bài viết tìm thấy
  } catch (error) {
    next(error); // Xử lý lỗi
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id; // Lấy ID người dùng từ token

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(errorHandler(404, "post not found"));
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
      post.numberOfLikes -= 1;
    } else {
      post.likes.push(userId);
      post.numberOfLikes += 1;
    }

    await post.save();
    res.status(200).json({
      message: hasLiked ? "Unliked post" : "liked post",
      numberOfLikes: post.numberOfLikes,
    });
  } catch (error) {
    next(error);
  }
};

export const bookmarkPost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id; // Lấy ID người dùng từ token

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(errorHandler(404, "post not found"));
    }

    const hasBookmarked = post.bookmarks.includes(userId);

    if (hasBookmarked) {
      post.bookmarks = post.bookmarks.filter((id) => id !== userId);
    } else {
      post.bookmarks.push(userId);
    }

    await post.save();
    res.status(200).json({
      message: hasBookmarked ? "unbookmark" : "bookmarked",
      bookmarked: !hasBookmarked,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookmarkedPosts = async (req, res, next) => {
  const userId = req.user.id; // Get the user ID from the token

  try {
    // Fetch posts where the bookmarks array contains the userId
    const bookmarkedPosts = await Post.find({ bookmarks: userId });

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    next(error); // Handle errors
  }
};
