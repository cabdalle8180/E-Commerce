import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const exists = await User.findOne({ username });
    if (exists) {
      exists.role = "admin";
      await exists.save();
      console.log(`User "${username}" updated to admin role.`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        fullName: "Store Admin",
        username,
        email: "admin@somcart.com",
        password: hashedPassword,
        role: "admin",
        address: {
          country: "Somalia",
          city: "Mogadishu",
          district: "Hodan",
          street: "Main Street",
        },
      });
      console.log(`Admin created — username: ${username}, password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
