const UserPreferences = require("../models/UserPreferences");

/* ======================================
   SAVE / UPDATE USER PREFERENCES
====================================== */
exports.savePreferences = async (req, res) => {
  try {
    const userId = req.userId;

    const { additional, financial } = req.body;

    const prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { additional, financial },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Preferences saved successfully",
      data: prefs
    });
  } catch (err) {
    console.error("❌ Save Preferences Error:", err);
    res.status(500).json({ message: "Failed to save preferences" });
  }
};

/* ======================================
   GET USER PREFERENCES
====================================== */
exports.getPreferences = async (req, res) => {
  try {
    const prefs = await UserPreferences.findOne({
      userId: req.userId
    });

    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load preferences" });
  }
};
