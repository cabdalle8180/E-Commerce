import { Router } from "express";
import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { uploadProductImage, handleUploadError } from "../middlewares/upload.js";

const router = Router();

router.post(
  "/",
  protectRoutes,
  adminCheck,
  uploadProductImage.single("image"),
  handleUploadError,
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put(
  "/:id",
  protectRoutes,
  adminCheck,
  uploadProductImage.single("image"),
  handleUploadError,
  updateProduct
);

router.delete("/:id", protectRoutes, adminCheck, deleteProduct);

export default router;
