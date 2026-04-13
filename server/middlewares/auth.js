const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // ❌ Wrong format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Token missing after Bearer
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 VERY IMPORTANT FOR KYC
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
