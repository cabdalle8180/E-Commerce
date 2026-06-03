import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description: "High-fidelity sound with active noise cancellation, 40-hour battery life, and comfortable over-ear design.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    category: "electronics",
    stock: 25,
    isActive: true,
  },
  {
    name: "Minimalist Smart Watch",
    description: "Track your activity, heart rate, sleep, and notifications with this elegant water-resistant smart watch.",
    price: 129.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    category: "electronics",
    stock: 15,
    isActive: true,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "Tactile brown switches with customizable RGB backlighting, durable aluminum frame, and media controls.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    category: "electronics",
    stock: 30,
    isActive: true,
  },
  {
    name: "Classic Leather Jacket",
    description: "Made from 100% genuine top-grain leather, featuring a comfortable polyester lining and heavy-duty zippers.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
    category: "fashion",
    stock: 10,
    isActive: true,
  },
  {
    name: "Athletic Red Sneakers",
    description: "Lightweight, breathable knit upper with responsive cushioning for everyday comfort and running performance.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    category: "fashion",
    stock: 45,
    isActive: true,
  },
  {
    name: "Vintage Canvas Backpack",
    description: "Spacious backpack with leather accents, laptop compartment, and multiple pockets for secure storage.",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    category: "fashion",
    stock: 20,
    isActive: true,
  },
  {
    name: "Insulated Stainless Water Bottle",
    description: "Double-walled vacuum insulation keeps beverages cold for 24 hours or hot for 12 hours. Leak-proof cap.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    category: "general",
    stock: 100,
    isActive: true,
  },
  {
    name: "Natural Scented Candle",
    description: "Hand-poured soy wax candle infused with lavender and eucalyptus essential oils for relaxation.",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60",
    category: "general",
    stock: 50,
    isActive: true,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing products
    await Product.deleteMany({});
    console.log("Deleted existing products.");

    // Seed products
    const created = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${created.length} sample products!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding products error:", error);
    process.exit(1);
  }
};

seedProducts();
