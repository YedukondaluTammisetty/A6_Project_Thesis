import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";

import logo from "../assets/transactpro.png";
import preview from "../assets/signup-preview.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
     HANDLE INPUT CHANGE
  ====================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ======================
     LOGIN HANDLER
  ====================== */
  const login = async () => {
    if (!form.identifier.trim() || !form.password) {
      alert("Please enter email/mobile and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        identifier: form.identifier.trim(),
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("mobile", res.data.mobile);
      localStorage.setItem("email", res.data.email);

      sessionStorage.removeItem("pinVerified");

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* ================= LEFT SIDE ================= */}
      <div className="auth-form">

        <div className="logo-wrapper">
          <img src={logo} alt="TransactPro" className="auth-logo" />
        </div>

        <h2>Welcome back</h2>
        <p>Please enter your login details</p>

        <input
          name="identifier"
          placeholder="Email or Mobile Number"
          value={form.identifier}
          onChange={handleChange}
          autoComplete="username"
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="auth-link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <p
          className="auth-link"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? <b>Create Account</b>
        </p>

        <p
          className="auth-link secondary"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </p>

      </div>


      {/* ================= RIGHT SIDE IMAGE ================= */}
      <div className="auth-preview">

        <img
          src={preview}
          alt="Dashboard Preview"
          className="preview-full-image"
        />

      </div>

    </div>
  );
}