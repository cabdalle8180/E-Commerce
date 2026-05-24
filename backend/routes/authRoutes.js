import {Router} from "express";
import { login, register } from "../Auth/authcontroller.js";
import {protectRoutes} from "../middlewares/ProtectRoutes.js";
const router = Router();

router.post("/login",protectRoutes,login);
router.post("/register", register);

export default router;