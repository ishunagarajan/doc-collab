const express = require("express");
const { check } = require("express-validator");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Enter a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], signup);

router.post("/login", login);

module.exports = router;
