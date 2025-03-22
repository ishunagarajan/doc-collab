require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ Added auth routes

const app = express();
connectDB(); // Connect to Mongo
app.use(express.json()); // Handle JSON data
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Sample API Route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// API Routes
app.use("/api/auth", authRoutes); // ✅ Auth routes
app.use("/api/documents", documentRoutes); // Document routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
