import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const TemporaryPassword = "admin123";

async function registerAdmin() {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    if (!ADMIN_EMAIL) {
      console.error("Missing ADMIN_EMAIL env variable");
      process.exit(1);
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash(
      TemporaryPassword,
      10
    );

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL
    });

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "ADMIN";

      await existingAdmin.save();

      console.log("Existing admin updated.");
      console.log("\nemail:", existingAdmin.email);
      console.log("password:", TemporaryPassword);

      process.exit(0);
    }

    const admin = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN"
    });

    console.log("Admin user created.");
    console.log("\nemail:", admin.email);
    console.log("password:", TemporaryPassword);
    console.log("\nChange the password after login.");

    process.exit(0);

  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

registerAdmin();