const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    /* ======================
       USER REFERENCE
    ====================== */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,          // ⛔ One KYC per user
      index: true
    },

    /* ======================
       PERSONAL DETAILS
    ====================== */
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    middleName: {
      type: String,
      trim: true,
      maxlength: 50
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    dob: {
      type: Date,
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },

    /* ======================
       ID DETAILS (SENSITIVE)
    ====================== */
    pan: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ // PAN format
    },

    aadhaar: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{12}$/ // Aadhaar format
    },

    /* ======================
       DOCUMENT FILE PATHS
    ====================== */
    photo: {
      type: String,
      default: null
    },

    panFile: {
      type: String,
      required: true
    },

    aadhaarFile: {
      type: String,
      required: true
    },

    /* ======================
       KYC STATUS
    ====================== */
    status: {
      type: String,
      enum: ["Not Verified", "Pending", "Verified", "Rejected"],
      default: "Pending",
      index: true
    },

    /* ======================
       ADMIN VERIFICATION
    ====================== */
    verifiedAt: {
      type: Date,
      default: null
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Kyc", kycSchema);
