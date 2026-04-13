const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    additional: {
      gender: String,
      ageGroup: String,
      maritalStatus: String,
      education: String,
      livingWith: String,
      interests: [String]
    },

    financial: {
      house: String,
      car: String,
      bike: String,
      income: String,
      investments: [String]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);
