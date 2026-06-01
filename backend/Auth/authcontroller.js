import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { formatUserResponse } from "../utils/formatUser.js";
import { deleteUploadFile } from "../utils/fileHelpers.js";

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, phone, address } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: formatUserResponse(newUser, token),
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

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

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: formatUserResponse(user, token),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (_req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePic) {
      deleteUploadFile(user.profilePic);
    }

    user.profilePic = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated",
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both passwords" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
