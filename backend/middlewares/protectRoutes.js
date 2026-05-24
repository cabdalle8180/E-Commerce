import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoutes = async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Not authorized as admin",
    });
  }
};