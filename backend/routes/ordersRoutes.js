import { Router } from "express";
import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = Router();

// Dhamaan routes-ka hoose waxay u baahan yihiin login (protectRoutes)
router.use(protectRoutes); 

router.post("/", createOrder);         // User-ka caadiga ah
router.get("/myorders", getMyOrders);   // User-ka caadiga ah
router.get("/:id", getOrderById);       // User-ka iska leh ama Admin

// Routes-kan hoose waxaa geli kara Admin kaliya
router.get("/", adminCheck, getAllOrders);
router.put("/:id/status", adminCheck, updateOrderStatus);

export default router;