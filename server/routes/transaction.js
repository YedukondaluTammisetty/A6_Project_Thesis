const express = require("express");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
💸 SEND MONEY
===================================================== */

router.post("/send", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let debitTxn, creditTxn;

  try {
    const { receiverMobile, amount, category = "Transfer", note = "" } = req.body;

    if (!receiverMobile || !amount || amount <= 0) {
      throw new Error("Invalid transaction details");
    }

    const sender = await User.findById(req.userId).session(session);
    if (!sender) throw new Error("Sender not found");

    if (String(sender.mobile) === String(receiverMobile)) {
      throw new Error("Cannot send money to yourself");
    }

    if (sender.walletBalance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const receiver = await User.findOne({ mobile: receiverMobile }).session(session);
    if (!receiver) throw new Error("Receiver not found");

    debitTxn = await Transaction.create(
      [
        {
          senderMobile: String(sender.mobile),
          receiverMobile: String(receiverMobile),
          amount,
          type: "debit",
          category,
          note,
          status: "pending"
        }
      ],
      { session }
    );

    creditTxn = await Transaction.create(
      [
        {
          senderMobile: String(sender.mobile),
          receiverMobile: String(receiverMobile),
          amount,
          type: "credit",
          category: "Incoming",
          status: "pending"
        }
      ],
      { session }
    );

    sender.walletBalance -= amount;
    receiver.walletBalance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    await Transaction.updateMany(
      { _id: { $in: [debitTxn[0]._id, creditTxn[0]._id] } },
      { status: "success" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    /* =========================
       CREATE NOTIFICATIONS
    ========================= */

    await Notification.create({
      userId: sender._id,
      message: `₹${amount} sent to ${receiver.mobile}`
    });

    await Notification.create({
      userId: receiver._id,
      message: `₹${amount} received from ${sender.mobile}`
    });

    res.json({ message: "Money sent successfully" });

  } catch (err) {

    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ error: err.message });
  }
});

/* =====================================================
💰 WALLET BALANCE
===================================================== */

router.get("/balance", authMiddleware, async (req, res) => {

  const user = await User.findById(req.userId);

  res.json({ walletBalance: user.walletBalance });

});

/* =====================================================
📜 TRANSACTION HISTORY
===================================================== */

router.get("/history", authMiddleware, async (req, res) => {

  const user = await User.findById(req.userId);
  const mobile = String(user.mobile);

  const txns = await Transaction.find({
    $or: [
      { senderMobile: mobile, type: "debit" },
      { receiverMobile: mobile, type: "credit" }
    ],
    status: "success"
  }).sort({ createdAt: -1 });

  res.json(txns);

});

/* =====================================================
📊 CURRENT MONTH EXPENSE
===================================================== */

router.get("/expense/current-month", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.userId);
    const mobile = String(user.mobile);

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          senderMobile: mobile,
          type: "debit",
          status: "success",
          createdAt: { $gte: start }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({ total: result[0]?.total || 0 });

  } catch (err) {

    res.status(500).json({ error: "Failed to calculate expense" });

  }

});

/* =====================================================
📊 CATEGORY ANALYTICS
===================================================== */

router.get("/expenses/category", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.userId);

    const data = await Transaction.aggregate([
      {
        $match: {
          senderMobile: String(user.mobile),
          type: "debit",
          status: "success"
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json(data);

  } catch {

    res.status(500).json({
      error: "Failed to load category analytics"
    });

  }

});

/* =====================================================
📈 MONTHLY SAVINGS (LAST 4 MONTHS)
===================================================== */

router.get("/savings/monthly", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.userId);
    const mobile = String(user.mobile);

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 3);
    fourMonthsAgo.setDate(1);

    const data = await Transaction.aggregate([
      {
        $match: {
          senderMobile: mobile,
          type: "debit",
          status: "success",
          createdAt: { $gte: fourMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalExpense: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(data);

  } catch {

    res.status(500).json({
      error: "Failed to load savings chart"
    });

  }

});

/* =====================================================
📄 MINI STATEMENT (PDF / CSV)
===================================================== */

router.get("/statement/:format", authMiddleware, async (req, res) => {

  try {

    const { format } = req.params;
    const limit = Number(req.query.limit || 10);

    const user = await User.findById(req.userId);

    const txns = await Transaction.find({
      $or: [
        { senderMobile: String(user.mobile), type: "debit" },
        { receiverMobile: String(user.mobile), type: "credit" }
      ],
      status: "success"
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (format === "csv") {

      const parser = new Parser();
      const csv = parser.parse(txns);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Mini_Statement.csv"
      );

      return res.send(csv);

    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Mini_Statement.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(18)
      .text("TransactPro Mini Statement", { align: "center" });

    doc.moveDown();

    txns.forEach((tx, i) => {
      doc.text(
        `${i + 1}. ${new Date(tx.createdAt).toLocaleString()} | ${tx.category} | ₹${tx.amount}`
      );
    });

    doc.end();

  } catch {

    res.status(500).json({
      error: "Failed to generate mini statement"
    });

  }

});

module.exports = router;