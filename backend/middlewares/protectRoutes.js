import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoutes = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminCheck = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
};
