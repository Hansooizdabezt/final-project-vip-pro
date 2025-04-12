import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (postData, user) => {
  const { title, content } = postData;

  if (!title || !content) {
    throw errorHandler(400, "Please provide all required fields");
  }

  // Check existing title
  const existingPost = await Post.findOne({ title });
  if (existingPost) {
    throw errorHandler(400, "Title already exists");
  }

  // Generate slug
  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  // Check existing slug
  const existingSlug = await Post.findOne({ slug });
  if (existingSlug) {
    throw errorHandler(400, "Slug already exists. Please modify the title.");
  }

  // Determine status based on user role
  const status = ["admin", "censor"].includes(user.role)
    ? "approved"
    : "pending";

  // Create and save post
  const newPost = new Post({
    ...postData,
    slug,
    userId: user.id,
    status,
  });

  const savedPost = await newPost.save();
  if (!savedPost?._id) {
    throw errorHandler(500, "Failed to save post: Missing postId");
  }

  return savedPost;
};

export const buildTimeFilter = (timePeriod) => {
  const now = new Date();
  let timeFilter = {};

  if (!timePeriod) return timeFilter;

  switch (timePeriod) {
    case "today":
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      timeFilter = { createdAt: { $gte: today } };
      break;
    case "yesterday":
      const yesterdayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const yesterdayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      timeFilter = { createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } };
      break;
    case "last7days":
      const last7Days = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
      timeFilter = { createdAt: { $gte: last7Days } };
      break;
    case "last30days":
      const last30Days = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30
      );
      timeFilter = { createdAt: { $gte: last30Days } };
      break;
    case "last90days":
      const last90Days = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 90
      );
      timeFilter = { createdAt: { $gte: last90Days } };
      break;
    default:
      break;
  }

  return timeFilter;
};

export const buildCategoryFilter = (category) => {
  return category ? { category: { $regex: category, $options: "i" } } : {};
};

export const buildSearchFilter = (searchTerm) => {
  return searchTerm
    ? {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};
};

export const getSortOptions = (sortBy, sortDirection) => {
  const validSortFields = ["numberOfLikes", "createdAt"];
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const direction = sortDirection === "asc" ? 1 : -1;

  return { [field]: direction };
};

export const getPosts = async (queryParams) => {
  const {
    startIndex = 0,
    limit = 9,
    sortBy = "createdAt",
    sort = "desc",
    timePeriod,
    category,
    userId,
    slug,
    postId,
    searchTerm,
  } = queryParams;

  const timeFilter = buildTimeFilter(timePeriod);
  const categoryFilter = buildCategoryFilter(category);
  const searchFilter = buildSearchFilter(searchTerm);
  const sortOptions = getSortOptions(sortBy, sort);

  const filter = {
    status: "approved",
    ...timeFilter,
    ...categoryFilter,
    ...(userId && { userId }),
    ...(slug && { slug }),
    ...(postId && { _id: postId }),
    ...searchFilter,
  };

  const posts = await Post.find(filter)
    .sort(sortOptions)
    .skip(parseInt(startIndex))
    .limit(parseInt(limit));

  const totalPosts = await Post.countDocuments({
    status: "approved",
    ...timeFilter,
    ...categoryFilter,
  });

  return { posts, totalPosts };
};
