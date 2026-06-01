import { Router } from "express";
import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = Router();

router.use(protectRoutes);

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.put("/:id/cancel", cancelOrder);
router.get("/admin/all", adminCheck, getAllOrders);
router.put("/:id/status", adminCheck, updateOrderStatus);
router.delete("/:id", adminCheck, deleteOrder);
router.get("/:id", getOrderById);

export default router;
