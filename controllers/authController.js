const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// 🟢 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🟢 Signup API
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim().toLowerCase();
  password = password.trim();

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Debugging logs
    console.log("Entered password at signup:", password);

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log hashed password
    console.log("Hashed Password before saving:", hashedPassword);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🟢 Login API
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  password = password.trim();

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user);
    console.log("Entered password at login:", password);
    console.log("Stored hashed password:", user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Comparing: Entered - '${password}' | Stored - '${user.password}'`);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
