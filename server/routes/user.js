const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const twilio = require("twilio");

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* =====================================================
   SET / UPDATE TRANSACTION PIN (LOGGED IN)
===================================================== */
router.post("/set-pin", authMiddleware, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN must be exactly 4 digits" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.pinHash = await bcrypt.hash(pin, 10);
    user.pinAttempts = 0;
    user.pinLockedUntil = null;

    await user.save();
    res.json({ message: "Transaction PIN set successfully" });

  } catch (err) {
    console.error("Set PIN error:", err.message);
    res.status(500).json({ error: "Failed to set PIN" });
  }
});

/* =====================================================
   VERIFY TRANSACTION PIN
===================================================== */
router.post("/verify-pin", authMiddleware, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "Enter valid 4-digit PIN" });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.pinHash) {
      return res.status(400).json({ error: "Transaction PIN not set" });
    }

    const isValid = await bcrypt.compare(pin, user.pinHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid PIN" });
    }

    res.json({ message: "PIN verified successfully" });

  } catch (err) {
    res.status(500).json({ error: "PIN verification failed" });
  }
});

/* =====================================================
   🔄 FORGOT PIN → SEND OTP (TWILIO)
===================================================== */
router.post("/forgot-pin", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: `+91${mobile}`,
        channel: "sms"
      });

    res.json({ message: "OTP sent to registered mobile number" });

  } catch (err) {
    console.error("Twilio send OTP error:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

/* =====================================================
   VERIFY OTP (TWILIO)
===================================================== */
router.post("/reset-pin-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${mobile}`,
        code: otp
      });

    if (verification.status !== "approved") {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.json({ message: "OTP verified" });

  } catch (err) {
    console.error("Twilio verify OTP error:", err.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

/* =====================================================
   SET NEW PIN
===================================================== */
router.post("/set-new-pin", async (req, res) => {
  try {
    const { mobile, newPin } = req.body;

    if (!/^\d{4}$/.test(newPin)) {
      return res.status(400).json({ error: "PIN must be exactly 4 digits" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.pinHash = await bcrypt.hash(newPin, 10);
    user.pinAttempts = 0;
    user.pinLockedUntil = null;

    await user.save();
    res.json({ message: "Transaction PIN reset successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to reset PIN" });
  }
});

module.exports = router;
