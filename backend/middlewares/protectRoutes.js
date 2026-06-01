// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoutes = async (req, res, next) => {
//   let token;

//   if (req.cookies?.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return res.status(401).json({
//       message: "Not authorized, no token",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decoded.userId).select("-password");

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       message: "Not authorized, token failed",
//     });
//   }
// };

// export const adminCheck = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     return res.status(403).json({
//       message: "Not authorized as admin",
//     });
//   }
// };
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Hubi in 'user.js' uu heruf yar yahay ama weyn yahay saaxiib

export const protectRoutes = async (req, res, next) => {
  let token;

  // 1. Halkaan ka eeg: Waxay hadda ka akhrisaneysaa Headers-ka (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Ka soo saar token-ka qoraalka "Bearer <TOKEN>"
      token = req.headers.authorization.split(" ")[1];

      // Hubi token-ka
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ku dar xogta user-ka 'req.user' adoo ka reebay password-ka
      req.user = await User.findById(decoded.userId).select("-password");

      return next(); // Sii soco
    } catch (error) {
      console.error("JWT Verify Error:", error);
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  // Haddii aan la helin wax token ah oo headers-ka ku jira
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
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