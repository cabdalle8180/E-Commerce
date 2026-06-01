import User from "../models/user.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

const formatCartItems = (cart) =>
  cart
    .filter((item) => item.product)
    .map((item) => ({
      _id: item.product._id.toString(),
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      stock: item.product.stock,
      quantity: item.quantity,
    }));

const getUserWithCart = (userId) =>
  User.findById(userId).populate("cart.product");

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const user = await getUserWithCart(req.user._id);
    return res.status(200).json({
      message: "Cart fetched",
      cart: formatCartItems(user?.cart || []),
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/cart/sync — replace entire cart
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    const cart = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) continue;
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) continue;
      const qty = Math.max(1, Math.min(Number(item.quantity) || 1, product.stock));
      if (product.stock > 0) {
        cart.push({ product: product._id, quantity: qty });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cart },
      { new: true }
    ).populate("cart.product");

    return res.status(200).json({
      message: "Cart synced",
      cart: formatCartItems(user.cart),
    });
  } catch (error) {
    console.error("SYNC CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/cart — add or increase item
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    const existing = user.cart.find(
      (item) => item.product.toString() === productId
    );

    const qty = Math.max(1, Math.min(Number(quantity), product.stock));

    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else if (product.stock > 0) {
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();
    const updated = await getUserWithCart(req.user._id);

    return res.status(200).json({
      message: "Added to cart",
      cart: formatCartItems(updated.cart),
    });
  } catch (error) {
    console.error("ADD CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/cart/:productId — set quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = Math.min(qty, product.stock);
    }

    await user.save();
    const updated = await getUserWithCart(req.user._id);

    return res.status(200).json({
      message: "Cart updated",
      cart: formatCartItems(updated.cart),
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).populate("cart.product");

    return res.status(200).json({
      message: "Item removed",
      cart: formatCartItems(user.cart),
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/cart — clear all
export const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    return res.status(200).json({
      message: "Cart cleared",
      cart: [],
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
