import { Router } from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = Router();

router.use(protectRoutes);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
