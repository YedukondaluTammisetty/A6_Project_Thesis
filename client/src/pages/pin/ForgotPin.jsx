import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ForgotPin() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ======================
     SEND OTP HANDLER
  ====================== */
  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      alert("Enter a valid 10-digit registered mobile number");
      return;
    }

    try {
      setLoading(true);

      await API.post("/user/forgot-pin", { mobile });

      // ➡️ Go to OTP verification page
      navigate("/reset-pin-otp", {
        state: { mobile }
      });

    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Reset Transaction PIN 🔄</h2>

      <p style={{ color: "#6b7280", marginBottom: "12px" }}>
        Enter your registered mobile number to receive OTP
      </p>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Registered Mobile Number"
        value={mobile}
        maxLength={10}
        onChange={(e) =>
          setMobile(e.target.value.replace(/\D/g, ""))
        }
      />

      <button
        className="btn"
        onClick={sendOtp}
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
}
