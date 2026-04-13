const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* ======================
       BASIC USER INFO
    ====================== */
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      required: true
    },

    /* ======================
       WALLET
    ====================== */
    walletBalance: {
      type: Number,
      default: 0
    },

    /* ======================
       TRANSACTION PIN
    ====================== */
    pinHash: {
      type: String,
      default: null
    },

    pinAttempts: {
      type: Number,
      default: 0
    },

    pinLockedUntil: {
      type: Date,
      default: null
    },

    /* ======================
       LOGIN SECURITY
    ====================== */
    loginAttempts: {
      type: Number,
      default: 0
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    /* ======================
       OTP (FOR AUTH / RESET)
    ====================== */
    otp: {
      type: String
    },

    otpExpiry: {
      type: Date
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    /* ======================
       PROFILE DETAILS
    ====================== */
    profile: {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      dob: { type: String },
      address: { type: String }
    },

    /* ======================
       KYC DETAILS
    ====================== */
    kyc: {
      pan: {
        type: String
      },

      aadhaar: {
        type: String
      },

      panFile: {
        type: String // file path / cloud URL
      },

      aadhaarFile: {
        type: String // file path / cloud URL
      },

      photo: {
        type: String // profile photo path / cloud URL
      },

      status: {
        type: String,
        enum: ["NOT_VERIFIED", "PENDING", "VERIFIED", "REJECTED"],
        default: "NOT_VERIFIED"
      },

      remark: {
        type: String // admin rejection reason
      },

      submittedAt: {
        type: Date
      },

      verifiedAt: {
        type: Date
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
