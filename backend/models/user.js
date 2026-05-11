import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },

    username: { type: String, unique: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, minlength: 6 },

    phone: { type: String, default: "" },

    profilePic: { type: String, default: "" },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: { type: Boolean, default: false },

    address: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      district: { type: String, default: "" },
      street: { type: String, default: "" },
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    resetPasswordToken: { type: String, default: "" },

    resetPasswordExpire: { type: Date },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// IMPORTANT FIX 👇
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;