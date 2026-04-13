import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function SetNewPin() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const mobile = state?.mobile;
  const otp = state?.otp;

  /* ======================
     PROTECT DIRECT ACCESS
  ====================== */
  useEffect(() => {
    if (!mobile || !otp) {
      navigate("/forgot-pin", { replace: true });
    }
  }, [mobile, otp, navigate]);

  /* ======================
     SET NEW PIN
  ====================== */
  const setNewPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      alert("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      alert("PINs do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/user/set-new-pin", {
        mobile,
        otp,
        newPin: pin
      });

      alert("Transaction PIN reset successfully");

      // 🔐 CLEAR ANY PREVIOUS PIN SESSION
      sessionStorage.removeItem("pinVerified");
      sessionStorage.removeItem("lastPin");

      navigate("/login", { replace: true });

    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Set New Transaction PIN 🔑</h2>

      <p style={{ color: "#6b7280", marginBottom: "12px" }}>
        Create a new 4-digit PIN for transactions
      </p>

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        placeholder="Enter new 4-digit PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
      />

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        placeholder="Confirm new PIN"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
      />

      <button
        className="btn"
        onClick={setNewPin}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Set New PIN"}
      </button>
    </div>
  );
}
