import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//sign up a user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem tất cả các trường có được điền hay không
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Kiểm tra xem username đã tồn tại hay chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists")); // Trả về lỗi nếu username đã tồn tại
    }

    const existngEmail = await User.findOne({ email });
    if (existngEmail) {
      return next(errorHandler(400, "Email have been used")); // Trả về lỗi nếu username đã tồn tại
    }

    // Mã hóa password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Xử lý lỗi tại đây
    next(error); // Nếu có lỗi, chuyển đến middleware xử lý lỗi
  }
};

//sign in a user
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    // Tạo token JWT
    const token = jwt.sign(
      {
        id: validUser._id,
        role: validUser.role,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    // Gửi phản hồi thành công với token và thông báo
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true }) // Lưu token vào cookie với tùy chọn httpOnly
      .json(rest); // Trả về thông tin user mà không bao gồm password
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoURL,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
