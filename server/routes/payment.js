const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

/* ======================
   RAZORPAY INSTANCE
====================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ======================
   CREATE ORDER
====================== */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `wallet_add_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay create order error:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

/* ======================
   VERIFY PAYMENT
====================== */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mobile,
      amount
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !mobile ||
      !amount
    ) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    /* ======================
       VERIFY SIGNATURE
    ====================== */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // ❌ Store failed transaction
      await Transaction.create({
        senderMobile: "SELF",
        receiverMobile: mobile,
        amount,
        type: "credit",
        status: "failed",
        failureReason: "Razorpay signature mismatch",
        razorpayPaymentId: razorpay_payment_id
      });

      return res.status(400).json({ error: "Payment verification failed" });
    }

    /* ======================
       UPDATE WALLET
    ====================== */
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.walletBalance += Number(amount);
    await user.save();

    /* ======================
       STORE SUCCESS TRANSACTION
    ====================== */
    await Transaction.create({
      senderMobile: "SELF",
      receiverMobile: mobile,
      amount,
      type: "credit",
      status: "success",
      razorpayPaymentId: razorpay_payment_id
    });

    res.json({ message: "Money added successfully" });

  } catch (err) {
    console.error("❌ Razorpay verify error:", err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
