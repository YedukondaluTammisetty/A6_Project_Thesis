const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");          // JWT authentication
const upload = require("../middlewares/upload");      // Multer upload config
const { submitKyc } = require("../controllers/kycController");

/* =====================================================
   SUBMIT KYC
   - Protected route
   - multipart/form-data
   - Files: photo, panFile, aadhaarFile
===================================================== */
router.post(
  "/submit",
  auth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "aadhaarFile", maxCount: 1 }
  ]),
  submitKyc
);

module.exports = router;
