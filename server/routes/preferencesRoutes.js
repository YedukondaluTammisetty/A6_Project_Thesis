const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  savePreferences,
  getPreferences
} = require("../controllers/preferencesController");

router.post("/save", auth, savePreferences);
router.get("/", auth, getPreferences);

module.exports = router;
