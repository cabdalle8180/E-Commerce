import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const restoreOrderStock = async (order) => {
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }
};

// 1. CREATE NEW ORDER (Abuurista Dalab Cusub)
export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;
    const userId = req.user._id; // Waxaa laga helayaa protectRoutes middleware

    // Hubi in alaab la soo diray
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({ message: "Please provide complete shipping address" });
    }

    let totalPrice = 0;
    const orderProducts = [];

    // Loop lagu sameynayo alaabta si loo xaqiijiyo qiimaha iyo stock-ga database-ka ku jira
    for (const item of products) {
      const productData = await Product.findById(item.product);
      
      if (!productData) {
        return res.status(404).json({ message: `Product not found with ID: ${item.product}` });
      }

      // Hubi haddii stock-gu ku filan yahay
      if (productData.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${productData.name}. Only ${productData.stock} left.` 
        });
      }

      // Xisaabi qiimaha guud ee alaabtan
      const itemPrice = productData.price;
      totalPrice += itemPrice * item.quantity;

      // Ku dar alaabta array-ga cusub ee dalabka
      orderProducts.push({
        product: item.product,
        quantity: item.quantity,
        price: itemPrice // Qiimaha hadda ka jira database-ka
      });

      // Laga jarayo stock-ga maadaama la iibsaday (Optional: Waxaad samayn kartaa markii la bixiyo lacagta)
      productData.stock -= item.quantity;
      await productData.save();
    }

    // Abuur dalabka cusub
    const newOrder = await Order.create({
      user: userId,
      products: orderProducts,
      totalPrice,
      shippingAddress,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
      cart: [],
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 2. GET USER ORDERS (Isticmaalaha caadiga ah si uu u arko dalabyadiisa oo kaliya)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Soo saar dhamaan orders-ka user-kaan leeyahay, soo raaci xogta alaabta (name, image)
    const orders = await Order.find({ user: userId })
      .populate("products.product", "name image")
      .sort("-createdAt"); // Kuwa ugu dambeeyay kor u soo qaad

    return res.status(200).json({
      message: "Your orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 3. GET ORDER BY ID (Aragti dalab gaar ah - mid user ama admin)
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    // Soo qaad order-ka, ku dar magaca iyo email-ka user-ka soo iibsaday iyo macluumaadka alaabta
    const order = await Order.findById(orderId)
      .populate("user", "fullName username email")
      .populate("products.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Hubi qofka codsanaya haddii uusan admin ahayn in uu isagu leeyahay order-ka
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 4. GET ALL ORDERS (Admin Only - Dhamaan dalabyada dukaanka)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName username email")
      .populate("products.product", "name image price")
      .sort("-createdAt");

    return res.status(200).json({
      message: "All orders fetched successfully (Admin)",
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 5. CANCEL ORDER (User — pending only)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    await restoreOrderStock(order);

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 6. DELETE ORDER (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "pending") {
      await restoreOrderStock(order);
    }

    await Order.findByIdAndDelete(orderId);
    await User.updateMany(
      { orders: orderId },
      { $pull: { orders: orderId } }
    );

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 7. UPDATE ORDER STATUS (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;

    if (status === "cancelled" && previousStatus === "pending") {
      await restoreOrderStock(order);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};