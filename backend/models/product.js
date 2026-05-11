import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    image: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        default: "general",
    },

    stock: {
        type: Number,
        default: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
}
);

const Product = mongoose.model("Product", productSchema);

export default Product;