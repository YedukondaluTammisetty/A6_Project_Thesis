import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // ⏱ OTP TIMER
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile;

  /* ===============================
     🔐 PROTECT PAGE
  =============================== */
  useEffect(() => {
    if (!mobile) {
      navigate("/forgot-password");
    }
  }, [mobile, navigate]);

  /* ===============================
     ⏱ OTP COUNTDOWN TIMER
  =============================== */
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    return `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;
  };

  /* ===============================
     ✅ VERIFY OTP
  =============================== */
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/verify-otp", {
        mobile,
        otp
      });

      // ➡️ MOVE TO SET NEW PASSWORD
      navigate("/new-password", { state: { mobile } });

    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 400);

      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     🔄 RESEND OTP
  =============================== */
  const resendOtp = async () => {
    if (!canResend) return;

    try {
      setLoading(true);

      await API.post("/auth/forgot-password", { mobile });

      setOtp("");
      setTimeLeft(30);
      setCanResend(false);

      alert("OTP resent successfully");

    } catch (err) {
      alert(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Verify OTP</h2>
        <p className="subtitle">
          Sit back and relax while we verify your mobile number
        </p>

        {/* 📱 MOBILE NUMBER (LOCKED) */}
        <input value={mobile} disabled />

        {/* 🔢 OTP INPUT + TIMER */}
        <div className="otp-row">
          <input
            className={shake ? "shake" : ""}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />

          <span className="otp-timer">{formatTime()}</span>
        </div>

        {/* 🔄 RESEND OTP */}
        <p className="resend-text">
          Didn’t receive OTP?
          <span
            className={`resend ${canResend ? "active" : "disabled"}`}
            onClick={canResend ? resendOtp : undefined}
          >
            Resend OTP
          </span>
        </p>

        {/* ✅ VERIFY BUTTON */}
        <button onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
