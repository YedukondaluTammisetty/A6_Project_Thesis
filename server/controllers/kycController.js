const Kyc = require("../models/Kyc");

/* =====================================================
   SUBMIT KYC
===================================================== */
exports.submitKyc = async (req, res) => {
  try {
    /* ======================
       AUTH CHECK
    ====================== */
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const userId = req.userId;

    /* ======================
       VALIDATE BODY
    ====================== */
    const {
      firstName,
      middleName,
      lastName,
      dob,
      address,
      pan,
      aadhaar
    } = req.body;

    if (!firstName || !lastName || !dob || !address || !pan || !aadhaar) {
      return res.status(400).json({
        message: "All KYC fields are required"
      });
    }

    /* ======================
       VALIDATE FILES
    ====================== */
    if (
      !req.files ||
      !req.files.panFile ||
      !req.files.aadhaarFile
    ) {
      return res.status(400).json({
        message: "PAN & Aadhaar documents are required"
      });
    }

    /* ======================
       PREVENT DUPLICATE KYC
    ====================== */
    const existingKyc = await Kyc.findOne({ userId });

    if (existingKyc) {
      return res.status(409).json({
        message: "KYC already submitted"
      });
    }

    /* ======================
       CREATE KYC RECORD
    ====================== */
    const kyc = await Kyc.create({
      userId,

      firstName,
      middleName,
      lastName,
      dob,
      address,

      pan,
      aadhaar,

      photo: req.files.photo?.[0]?.path || null,
      panFile: req.files.panFile[0].path,
      aadhaarFile: req.files.aadhaarFile[0].path,

      status: "Pending"
    });

    /* ======================
       SUCCESS RESPONSE
    ====================== */
    return res.status(201).json({
      message: "KYC submitted successfully",
      kyc
    });

  } catch (error) {
    console.error("❌ KYC SUBMIT ERROR:", error);

    return res.status(500).json({
      message: "KYC submission failed",
      error: error.message
    });
  }
};
