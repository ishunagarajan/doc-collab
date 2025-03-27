const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();

// 🛠️ Middleware
app.use(express.json()); // Enable JSON body parsing

// ✅ Enhanced CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow frontend requests
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// ✅ Ensure .env variables exist
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing environment variables. Check your .env file.");
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
