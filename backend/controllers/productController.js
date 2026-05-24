import Product from "../models/product.js";
import mongoose from "mongoose"; // Waxaa loo soo qaatay in lagu hubiyo ID-ga

// 1. CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, isActive } = req.body;

    // validation
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // create and save product (Habka ugu gaaban)
    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
      isActive,
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
    const products = await Product.find();
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

    // Hubi haddii ID-gu uusan sax ahayn (ku haboonayn MongoDB)
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
    const updates = req.body;

    // Hubi ID-ga
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // runValidators: true waxay hubisaa in xogta cusub ay raacayso shuruudiha Model-ka
    const product = await Product.findByIdAndUpdate(productId, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

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

    // Hubi ID-ga
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};