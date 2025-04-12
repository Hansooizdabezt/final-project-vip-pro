import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.send("This is a test");
};

export const updateUser = async (req, res, next) => {
  // Kiểm tra quyền
  const isAdmin = req.user.role === "admin";
  const isSelfUpdate = req.user.id === req.params.userId;

  if (!isAdmin && !isSelfUpdate) {
    return next(errorHandler(403, "You are not allowed to update this user!"));
  }

  // Kiểm tra mật khẩu
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters!"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Kiểm tra username
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters!")
      );
    }
  }

  // Kiểm tra role
  if (req.body.role) {
    const validRoles = ["user", "admin", "cencor"];
    if (!validRoles.includes(req.body.role)) {
      return next(errorHandler(400, "Invalid role!"));
    }
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId }, // Điều kiện tìm kiếm
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          role: req.body.role,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.role === "admin" && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user!"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been delete"); // No content response
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.role === "admin") {
    return next(errorHandler(403, "You are not allowed to access this route!"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
