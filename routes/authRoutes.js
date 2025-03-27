const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();

// 🛠️ Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1h", // Default to 1 hour if not set
  });
};

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("🔹 Signup Attempt:", email);

    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ status: "error", message: "User already exists" });
    }

    console.log("🔄 Hashing Password...");
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    console.log("✅ Hashed Password:", hashedPassword);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    console.log("🔄 Saving User...");
    await newUser.save();

    console.log("✅ User Registered Successfully:", newUser.email);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("🚨 Signup Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔹 Login Attempt:", email);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    console.log("✅ User Found:", user.email);
    console.log("🔒 Stored Password Hash:", user.password); // Debugging
    console.log("🔑 Entered Password:", password); // Debugging

    // 🔐 Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Incorrect password for:", email);
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    console.log("✅ Login Successful:", user.email);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🚨 Login Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
