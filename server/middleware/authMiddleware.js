const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Expect header format: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token missing or malformed"
      });
    }

    // ✅ Extract token safely
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach userId to request (used everywhere)
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
