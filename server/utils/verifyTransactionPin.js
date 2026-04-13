const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = async function verifyTransactionPin(userId, pin) {
  const user = await User.findById(userId);

  if (!user || !user.pinHash) {
    throw new Error("Transaction PIN not set");
  }

  // 🔒 Check if account is locked
  if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
    const minutesLeft = Math.ceil(
      (user.pinLockedUntil - new Date()) / 60000
    );
    throw new Error(
      `Account locked due to multiple wrong PIN attempts. Try again in ${minutesLeft} minutes`
    );
  }

  const isValid = await bcrypt.compare(pin, user.pinHash);

  if (!isValid) {
    user.pinAttempts += 1;

    // 🚫 Lock after 3 attempts
    if (user.pinAttempts >= 3) {
      user.pinLockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      user.pinAttempts = 0; // reset counter
    }

    await user.save();
    throw new Error("Invalid Transaction PIN");
  }

  // ✅ PIN correct → reset attempts
  user.pinAttempts = 0;
  user.pinLockedUntil = null;
  await user.save();

  return user;
};
