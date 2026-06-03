import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    sessionCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: String,
        fullName: String,
        flag: {
          type: String,
          default: "🇺🇸",
        },
        activeStep: {
          type: String,
          default: "Browsing Products",
        },
        lastActive: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedByUsername: String,
        addedByFlag: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model("Collaboration", collaborationSchema);
export default Collaboration;
