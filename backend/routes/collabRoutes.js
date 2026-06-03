import { Router } from "express";
import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
import {
  createSession,
  joinSession,
  getActiveSession,
  updateStep,
  addToCollabCart,
  updateCollabCart,
  removeFromCollabCart,
  leaveSession,
  getAdminActiveSessions,
} from "../controllers/collabController.js";

const router = Router();

// Protect all collaboration routes
router.use(protectRoutes);

router.post("/create", createSession);
router.post("/join", joinSession);
router.get("/session", getActiveSession);
router.put("/step", updateStep);
router.post("/cart", addToCollabCart);
router.put("/cart/:productId", updateCollabCart);
router.delete("/cart/:productId", removeFromCollabCart);
router.post("/leave", leaveSession);

// Admin-only routing
router.get("/admin/active", adminCheck, getAdminActiveSessions);

export default router;
