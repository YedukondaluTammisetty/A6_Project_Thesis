const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   ENSURE UPLOAD DIRECTORY EXISTS
===================================================== */
const uploadDir = path.join(__dirname, "..", "uploads", "kyc");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =====================================================
   STORAGE CONFIG
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${file.fieldname}-${uniqueName}${ext}`);
  }
});

/* =====================================================
   FILE FILTER (SECURITY)
===================================================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG images or PDF files are allowed"),
      false
    );
  }

  cb(null, true);
};

/* =====================================================
   MULTER INSTANCE
===================================================== */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
