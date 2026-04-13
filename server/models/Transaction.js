const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    /* ======================
       PARTICIPANTS
    ====================== */
    senderMobile: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    receiverMobile: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    /* ======================
       AMOUNT
    ====================== */
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least ₹1"]
    },

    /* ======================
       TRANSACTION TYPE
       debit | credit
    ====================== */
    type: {
      type: String,
      enum: {
        values: ["debit", "credit"],
        message: "Transaction type must be debit or credit"
      },
      required: true
    },

    /* ======================
       CATEGORY (EXPENSE ANALYTICS)
    ====================== */
    category: {
      type: String,
      enum: [
        "Food",
        "Rent",
        "Travel",
        "Shopping",
        "Education",
        "Utilities",
        "Medical",
        "Entertainment",
        "Transfer",
        "Incoming",
        "Others"
      ],
      default: "Others",
      index: true
    },

    /* ======================
       OPTIONAL NOTE
    ====================== */
    note: {
      type: String,
      trim: true,
      maxlength: [100, "Note cannot exceed 100 characters"],
      default: ""
    },

    /* ======================
       STATUS
       success | failed | pending
    ====================== */
    status: {
      type: String,
      enum: {
        values: ["success", "failed", "pending"],
        message: "Invalid transaction status"
      },
      default: "pending",
      index: true
    },

    /* ======================
       PAYMENT METADATA
    ====================== */

    // Razorpay payment ID (used only for add money)
    razorpayPaymentId: {
      type: String,
      default: null
    },

    // Failure reason if transaction fails
    failureReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/* ======================
   INDEXES (PERFORMANCE)
====================== */

// Fast history queries
transactionSchema.index({ senderMobile: 1, createdAt: -1 });
transactionSchema.index({ receiverMobile: 1, createdAt: -1 });

// Expense & analytics queries
transactionSchema.index({ category: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
