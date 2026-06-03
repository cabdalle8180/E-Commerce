import Collaboration from "../models/collaboration.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

// Generate a random 6-character uppercase alphanumeric code
const generateSessionCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "COLLAB-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 1. CREATE SESSION
export const createSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { flag = "🇺🇸" } = req.body;

    // Check if user already has an active session
    let session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    }).populate("cartItems.product");

    if (session) {
      return res.status(200).json({
        message: "Active session already exists",
        session,
      });
    }

    const sessionCode = generateSessionCode();
    session = await Collaboration.create({
      sessionCode,
      host: userId,
      members: [
        {
          user: userId,
          username: req.user.username,
          fullName: req.user.fullName,
          flag,
          activeStep: "Browsing Products",
          lastActive: new Date(),
        },
      ],
      cartItems: [],
    });

    return res.status(201).json({
      message: "Collaborative session created successfully",
      session,
    });
  } catch (error) {
    console.error("CREATE COLLAB SESSION ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 2. JOIN SESSION
export const joinSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionCode, flag = "🇺🇸" } = req.body;

    if (!sessionCode) {
      return res.status(400).json({ message: "Session code is required" });
    }

    const session = await Collaboration.findOne({
      sessionCode: sessionCode.toUpperCase().trim(),
      isActive: true,
    });

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    // Check if already a member
    const isMember = session.members.some(
      (m) => m.user.toString() === userId.toString()
    );

    if (!isMember) {
      session.members.push({
        user: userId,
        username: req.user.username,
        fullName: req.user.fullName,
        flag,
        activeStep: "Browsing Products",
        lastActive: new Date(),
      });
      await session.save();
    } else {
      // Update flag and active time if already in
      const member = session.members.find(
        (m) => m.user.toString() === userId.toString()
      );
      member.flag = flag;
      member.lastActive = new Date();
      await session.save();
    }

    const populated = await Collaboration.findById(session._id)
      .populate("cartItems.product")
      .populate("members.user", "fullName username");

    return res.status(200).json({
      message: "Joined collaborative session successfully",
      session: populated,
    });
  } catch (error) {
    console.error("JOIN COLLAB SESSION ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 3. GET USER'S ACTIVE SESSION
export const getActiveSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    }).populate("cartItems.product");

    return res.status(200).json({
      session: session || null,
    });
  } catch (error) {
    console.error("GET COLLAB SESSION ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 4. UPDATE USER'S ACTIVE STEP
export const updateStep = async (req, res) => {
  try {
    const userId = req.user._id;
    const { activeStep } = req.body;

    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    });

    if (!session) {
      return res.status(200).json({ session: null }); // silently return if no active session
    }

    const member = session.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (member) {
      member.activeStep = activeStep;
      member.lastActive = new Date();
      await session.save();
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("UPDATE COLLAB STEP ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 5. ADD TO COLLABORATIVE CART
export const addToCollabCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, flag = "🇺🇸" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    });

    if (!session) {
      return res.status(400).json({ message: "You are not in a collaborative session" });
    }

    const existingItem = session.cartItems.find(
      (item) => item.product.toString() === productId
    );

    const qty = Math.max(1, Math.min(Number(quantity), product.stock));

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + qty, product.stock);
    } else if (product.stock > 0) {
      session.cartItems.push({
        product: productId,
        quantity: qty,
        addedBy: userId,
        addedByUsername: req.user.username,
        addedByFlag: flag,
      });
    }

    await session.save();
    const populated = await Collaboration.findById(session._id).populate("cartItems.product");

    return res.status(200).json({
      message: "Added to collaborative cart",
      session: populated,
    });
  } catch (error) {
    console.error("ADD TO COLLAB CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 6. UPDATE COLLABORATIVE CART QUANTITY
export const updateCollabCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    });

    if (!session) {
      return res.status(400).json({ message: "You are not in a collaborative session" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = session.cartItems.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not in shared cart" });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      session.cartItems = session.cartItems.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      item.quantity = Math.min(qty, product.stock);
    }

    await session.save();
    const populated = await Collaboration.findById(session._id).populate("cartItems.product");

    return res.status(200).json({
      message: "Shared cart updated",
      session: populated,
    });
  } catch (error) {
    console.error("UPDATE COLLAB CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 7. REMOVE FROM COLLABORATIVE CART
export const removeFromCollabCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    });

    if (!session) {
      return res.status(400).json({ message: "You are not in a collaborative session" });
    }

    session.cartItems = session.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    await session.save();
    const populated = await Collaboration.findById(session._id).populate("cartItems.product");

    return res.status(200).json({
      message: "Removed from shared cart",
      session: populated,
    });
  } catch (error) {
    console.error("REMOVE COLLAB CART ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 8. LEAVE SESSION
export const leaveSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const session = await Collaboration.findOne({
      isActive: true,
      "members.user": userId,
    });

    if (!session) {
      return res.status(400).json({ message: "No active session found" });
    }

    // Remove user from members
    session.members = session.members.filter(
      (m) => m.user.toString() !== userId.toString()
    );

    if (session.members.length === 0) {
      session.isActive = false;
    } else if (session.host.toString() === userId.toString()) {
      // Reassign host
      session.host = session.members[0].user;
    }

    await session.save();

    return res.status(200).json({
      message: "Left collaborative session",
    });
  } catch (error) {
    console.error("LEAVE COLLAB SESSION ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 9. GET ADMIN ACTIVE USERS (Admin Only)
export const getAdminActiveSessions = async (req, res) => {
  try {
    // Find active sessions that have members active in the last 15 minutes
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    const sessions = await Collaboration.find({
      isActive: true,
      "members.lastActive": { $gte: cutoff },
    })
      .populate("members.user", "fullName username email")
      .populate("cartItems.product", "name price");

    return res.status(200).json({
      message: "Fetched active monitoring sessions successfully",
      sessions,
    });
  } catch (error) {
    console.error("GET ADMIN ACTIVE SESSIONS ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
