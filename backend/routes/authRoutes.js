import { Router } from "express";
import {
  login,
  register,
  logout,
  getMe,
  updateProfile,
  uploadProfilePic,
  changePassword,
} from "../Auth/authcontroller.js";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import { uploadProfileImage, handleUploadError } from "../middlewares/upload.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.get("/me", protectRoutes, getMe);
router.put("/profile", protectRoutes, updateProfile);
router.put(
  "/profile-pic",
  protectRoutes,
  uploadProfileImage.single("profilePic"),
  handleUploadError,
  uploadProfilePic
);
router.put("/change-password", protectRoutes, changePassword);

export default router;
