import jwt from "jsonwebtoken";
import User from "../models/User.js";

 const protectRoutes = async (req, res, next) => {
  let token;

  // Check token from cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.userId).select("-password");

    // admin chcck
    
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};


export default protectRoutes;