import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from "lucide-react";

import logo from "../assets/transactpro.png";
import preview from "../assets/signup-preview.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dob: "",
    pan: "",
    aadhaar: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  // 👁️ password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ======================
     🔐 AUTO REDIRECT IF LOGGED IN
  ====================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  /* ======================
     PASSWORD STRENGTH
  ====================== */
  const strength = zxcvbn(form.password).score;
  const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

  /* ======================
     HANDLE INPUT CHANGE
  ====================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================
     SIGNUP HANDLER
  ====================== */
  const signup = async () => {
    if (!form.firstName || !form.lastName || !form.mobile || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/signup", form);

      alert("Signup successful! Please login.");
      navigate("/login", { replace: true });

    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ================= LEFT FORM ================= */}
      <div className="auth-form">
        <img src={logo} alt="TransactPro" className="auth-logo" />

        <h2>Sign up</h2>
        <p>Please enter your details</p>

        <div className="row">
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        </div>

        <input name="address" placeholder="Address" onChange={handleChange} />

        <div className="row">
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="state" placeholder="State" onChange={handleChange} />
        </div>

        <div className="row">
          <input name="pincode" placeholder="Postal Code" onChange={handleChange} />
          <input type="date" name="dob" onChange={handleChange} />
        </div>

        <div className="row">
          <input name="pan" placeholder="PAN Number" onChange={handleChange} />
          <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} />
        </div>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} />

        {/* 🔐 PASSWORD WITH EYE ICON */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* 🔐 PASSWORD STRENGTH BAR */}
        <div className="password-meter">
          <div
            style={{
              width: `${(strength + 1) * 20}%`,
              background: colors[strength]
            }}
          />
        </div>

        {/* 🔐 CONFIRM PASSWORD WITH EYE ICON */}
        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button onClick={signup} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* 🔗 AUTH LINKS */}
        <p className="auth-link" onClick={() => navigate("/login")}>
          Already have an account? <b>Login</b>
        </p>

        <p className="auth-link secondary" onClick={() => navigate("/")}>
          ← Back to Home
        </p>
      </div>

      {/* ================= RIGHT PREVIEW ================= */}
      <div className="auth-preview">
        <div className="preview-card">
          <img src={preview} alt="Dashboard Preview" />
        </div>
      </div>
    </div>
  );
}
