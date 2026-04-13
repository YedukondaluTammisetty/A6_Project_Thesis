import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

export default function VerifyPin() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 Where to go after PIN verification
  const redirectTo = location.state?.redirectTo || "/dashboard";

  /* ======================
     🧹 CLEAN PREVIOUS STATE
  ====================== */
  useEffect(() => {
    // Clear previous verification on fresh visit
    sessionStorage.removeItem("pinVerified");
  }, []);

  /* ======================
     🔐 VERIFY PIN
  ====================== */
  const verifyPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      alert("Enter a valid 4-digit PIN");
      return;
    }

    try {
      setLoading(true);

      // 🔐 VERIFY PIN WITH BACKEND
      await API.post("/user/verify-pin", { pin });

      // ✅ SESSION FLAG (NO PIN STORED)
      sessionStorage.setItem("pinVerified", "true");

      // ➡️ REDIRECT TO ORIGINAL PAGE
      navigate(redirectTo, { replace: true });

    } catch (err) {
      alert(err.response?.data?.error || "Invalid PIN");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     🔄 FORGOT PIN
  ====================== */
  const handleForgotPin = () => {
    sessionStorage.removeItem("pinVerified");
    navigate("/forgot-pin");
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Enter Transaction PIN 🔐</h2>
        <p className="subtitle">
          Please confirm your PIN to continue
        </p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        />

        <button
          className="btn"
          onClick={verifyPin}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify PIN"}
        </button>

        <p
          className="link-text"
          onClick={handleForgotPin}
        >
          Forgot PIN?
        </p>
      </div>
    </div>
  );
}
