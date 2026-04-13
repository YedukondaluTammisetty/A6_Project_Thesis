const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* ======================
   HELPERS
====================== */
const normalizeMobile = (mobile) => {
  if (!mobile) return null;

  // remove spaces
  let m = mobile.toString().trim();

  // remove +91 if user entered it
  if (m.startsWith("+91")) {
    m = m.slice(3);
  }

  // remove leading 0
  if (m.startsWith("0")) {
    m = m.slice(1);
  }

  return `+91${m}`;
};

/* ======================
   SEND OTP (TWILIO VERIFY)
====================== */
const sendSMS = async (mobile) => {
  try {
    const to = normalizeMobile(mobile);

    if (!to) {
      throw new Error("Invalid mobile number");
    }

    console.log("📤 Sending OTP to:", to);

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to,
        channel: "sms"
      });

    console.log("✅ OTP sent successfully");
    return true;

  } catch (err) {
    console.error("❌ Twilio send OTP error:", err.message);
    throw new Error("Failed to send OTP");
  }
};

/* ======================
   VERIFY OTP (TWILIO VERIFY)
====================== */
const verifyOTP = async (mobile, otp) => {
  try {
    const to = normalizeMobile(mobile);

    if (!to || !otp) {
      return false;
    }

    console.log("🔍 Verifying OTP for:", to, "OTP:", otp.toString());

    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to,
        code: otp.toString()   // OTP MUST be string
      });

    console.log("📨 Twilio verify status:", result.status);

    return result.status === "approved";

  } catch (err) {
    console.error("❌ Twilio verify OTP error:", err.message);
    return false;
  }
};

module.exports = { sendSMS, verifyOTP };
