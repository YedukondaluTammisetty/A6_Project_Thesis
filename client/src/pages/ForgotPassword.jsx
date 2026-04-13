import { useState, useEffect } from "react";
import API from "../services/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  /* OTP TIMER */
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer, step]);

  const sendOtp = async () => {
    if (!mobile) return alert("Enter mobile number");
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { mobile });
      setStep(2);
      setTimer(30);
    } catch (err) {
      alert(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { mobile, otp });
      setStep(3);
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <p className="subtitle">
          Sit back and relax while we verify your mobile number
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              placeholder="Registered Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input value={mobile} disabled />
            <div className="otp-row">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <span
                className={`otp-timer ${timer === 0 ? "expired" : ""}`}
              >
                00:{timer.toString().padStart(2, "0")}
              </span>
            </div>

            <button onClick={verifyOtp}>Verify OTP</button>

            {timer === 0 && (
              <button className="resend-btn" onClick={sendOtp}>
                Resend OTP
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
