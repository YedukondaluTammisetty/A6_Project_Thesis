import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import zxcvbn from "zxcvbn";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const mobile = state?.mobile;

  // ✅ SAFE redirect
  useEffect(() => {
    if (!mobile) navigate("/forgot-password");
  }, [mobile, navigate]);

  const strength = zxcvbn(newPassword).score;

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/reset-password", {
        mobile,
        newPassword,
        confirmPassword
      });

      alert("Password reset successful. Please login.");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Set New Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* 🔐 PASSWORD STRENGTH BAR */}
      <div className="password-meter">
        <div className={`password-meter-fill strength-${strength}`} />
      </div>

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="btn" onClick={resetPassword} disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
}
