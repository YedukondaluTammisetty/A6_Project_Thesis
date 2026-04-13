const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtpSms = async (mobile, otp) => {
  try {
    await client.messages.create({
      body: `Your TransactPro PIN reset OTP is ${otp}. Valid for 10 minutes.`,
      from: "+15017122661", // Twilio trial sender
      to: `+91${mobile}`
    });

    console.log("✅ OTP sent via Twilio to", mobile);
  } catch (err) {
    console.error("❌ Twilio SMS Error:", err.message);
    throw new Error("Failed to send OTP");
  }
};

module.exports = sendOtpSms;
