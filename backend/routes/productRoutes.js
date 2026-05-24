// import { Router } from "express";
// // import {protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
// import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
// import {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct
// } from "../controllers/productController.js";

// const router = Router();

// // Create a new product (admin only)
// router.post("/", protectRoutes, adminCheck, createProduct);
// // Get all products
// router.get("/", getProducts);
// // Get a product by ID
// router.get("/:id", getProductById);
// // Update a product (admin only)
// router.put("/:id", protectRoutes, adminCheck, updateProduct);
// // Delete a product (admin only)
// router.delete("/:id", protectRoutes, adminCheck, deleteProduct);

// export default router;














import { Router } from "express";
import { protectRoutes, adminCheck } from "../middlewares/protectRoutes.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = Router();

// Create a new product (admin only)
router.post("/", protectRoutes, adminCheck, createProduct);

// Get all products
router.get("/", getProducts);

// Get a product by ID
router.get("/:id", getProductById);

// Update a product (admin only)
router.put("/:id", protectRoutes, adminCheck, updateProduct);

// Delete a product (admin only)
router.delete("/:id", protectRoutes, adminCheck, deleteProduct);

export default router;