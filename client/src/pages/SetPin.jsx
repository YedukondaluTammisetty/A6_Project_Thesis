import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function SetPin() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setTransactionPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      alert("PIN must be exactly 4 digits");
      return;
    }

    try {
      setLoading(true);

      await API.post("/user/set-pin", { pin });

      alert("Transaction PIN set successfully");

      // 🔐 Clear any previous PIN verification
      sessionStorage.removeItem("pinVerified");
      sessionStorage.removeItem("lastPin");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Set Transaction PIN 🔐</h2>

      <input
        type="password"
        inputMode="numeric"
        placeholder="Enter 4-digit PIN"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
      />

      <button
        className="btn"
        onClick={setTransactionPin}
        disabled={loading}
      >
        {loading ? "Setting PIN..." : "Set PIN"}
      </button>

      {/* 🔄 FORGOT PIN LINK */}
      <p
        style={{
          marginTop: "14px",
          textAlign: "center",
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: 500
        }}
        onClick={() => navigate("/forgot-pin")}
      >
        Forgot PIN?
      </p>
    </div>
  );
}
