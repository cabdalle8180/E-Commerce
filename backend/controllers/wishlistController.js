import User from "../models/user.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    return res.status(200).json({
      wishlist: user?.wishlist || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    return res.status(200).json({
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    return res.status(200).json({
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
