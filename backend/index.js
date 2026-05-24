import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbs.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello World");
});

// routes
app.use("/api/auth", authRoutes);
// product routes
app.use("/api/products", productRoutes);
// order routes
app.use("/api/orders", ordersRoutes);


const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
    console.log(`server is running on port at http://localhost:${PORT}`)
})