import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password,phone,address } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await newUser.save();

    // create token (IMPORTANT FIX)
    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        granted: newUser.role,
        token

      },
    });
  }

catch (error) {
  console.log("REGISTER ERROR:", error);
  return res.status(500).json({ message: error.message });
}

}

// login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    // create token (IMPORTANT FIX)
   const token = generateToken(user._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        granted: user.role,
        token
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

