import { Router } from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import {
  getCart,
  syncCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.use(protectRoutes);

router.get("/", getCart);
router.put("/sync", syncCart);
router.post("/", addToCart);
router.delete("/", clearCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

export default router;
