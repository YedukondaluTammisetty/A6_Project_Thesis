import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ResetPinOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const mobile = state?.mobile;

  /* ======================
     PROTECT DIRECT ACCESS
  ====================== */
  useEffect(() => {
    if (!mobile) {
      navigate("/forgot-pin", { replace: true });
    }
  }, [mobile, navigate]);

  /* ======================
     VERIFY OTP
  ====================== */
  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await API.post("/user/reset-pin-otp", { mobile, otp });

      navigate("/set-new-pin", {
        state: { mobile, otp }
      });

    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Verify OTP 🔐</h2>

      <p style={{ color: "#6b7280", marginBottom: "12px" }}>
        Enter the OTP sent to your registered mobile number
      </p>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
      />

      <button
        className="btn"
        onClick={verifyOtp}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
