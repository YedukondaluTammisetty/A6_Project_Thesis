// ======================
// LOAD ENV (MUST BE FIRST)
// ======================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

/* ======================
   DATABASE CONNECTION
====================== */
connectDB();

/* ======================
   MIDDLEWARES
====================== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ======================
   ROUTES
====================== */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/transaction", require("./routes/transaction"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/user", require("./routes/user"));
app.use("/api/kyc", require("./routes/kycRoutes"));
app.use("/api/preferences", require("./routes/preferencesRoutes"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/budget", require("./routes/budget"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/notifications", require("./routes/notifications"));

/* ⭐ INCOME ROUTE */
app.use("/api/income", require("./routes/income"));

/* ⭐ NOTIFICATION ROUTE (NEW) */
app.use("/api/notifications", require("./routes/notifications"));

/* ======================
   HEALTH CHECK
====================== */
app.get("/health", (req, res) => {
  res.status(200).send("🚀 TransactPro Backend Running");
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});