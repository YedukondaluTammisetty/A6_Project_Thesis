const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSMS, verifyOTP } = require("../utils/sendSMS");

const router = express.Router();

/* ======================
   SIGNUP
====================== */
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    if (!firstName || !lastName || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: `${firstName} ${lastName}`,
      email,
      mobile,
      password: hashedPassword,
      isVerified: true,
      walletBalance: 0
    });

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/* ======================
   LOGIN  ✅ FIXED
====================== */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ IMPORTANT: return email also
    res.json({
      token,
      mobile: user.mobile,
      email: user.email
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ======================
   STEP 1: FORGOT PASSWORD (SEND OTP)
====================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: "Mobile number required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await sendSMS(mobile);
    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

/* ======================
   STEP 2: VERIFY OTP
====================== */
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP required" });
    }

    const isValid = await verifyOTP(mobile, otp);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

/* ======================
   STEP 3: RESET PASSWORD
====================== */
router.post("/reset-password", async (req, res) => {
  try {
    const { mobile, newPassword, confirmPassword } = req.body;

    if (!mobile || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;
