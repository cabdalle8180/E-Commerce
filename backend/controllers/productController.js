import Product from "../models/product.js";
import mongoose from "mongoose";
import { deleteProductImage } from "../utils/fileHelpers.js";

const getImagePath = (req) => {
  if (req.file) {
    return `/uploads/products/${req.file.filename}`;
  }
  return req.body.image || "";
};

// 1. CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;
    const image = getImagePath(req);

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      stock: stock !== undefined ? Number(stock) : 0,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 2. GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.active !== "false") {
      filter.isActive = true;
    }

    const products = await Product.find(filter).sort("-createdAt");
    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 3. GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log("GET PRODUCT BY ID ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 4. UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const existing = await Product.findById(productId);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === "true" || updates.isActive === true;
    }

    if (req.file) {
      deleteProductImage(existing.image);
      updates.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 5. DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    deleteProductImage(product.image);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
