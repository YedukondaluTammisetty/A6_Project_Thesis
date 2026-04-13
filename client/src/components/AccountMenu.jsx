import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/account-menu.css";

export default function AccountMenu({ onClose }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ===============================
     CLOSE ON OUTSIDE CLICK
  ================================ */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  /* ===============================
     DARK MODE TOGGLE
  ================================ */
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.body.classList.toggle("dark", next);
  };

  /* ===============================
     USER INFO
  ================================ */
  const email = localStorage.getItem("email");
  const name = email?.split("@")[0] || "User";
  const mobile = localStorage.getItem("mobile") || "XXXXXXXXXX";

  /* ===============================
     LOGOUT
  ================================ */
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="account-menu" ref={menuRef}>
      {/* HEADER */}
      <div className="account-header">
        <div className="avatar big">{name[0].toUpperCase()}</div>

        <div className="account-info">
          <div className="account-name">{name}</div>
          <div className="account-email">{email}</div>
          <div className="account-mobile">+91 {mobile}</div>
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="account-links">
        <div onClick={() => navigate("/my-qr")}>📱 My QR Code</div>
        <div onClick={() => navigate("/profile")}>👤 Profile & KYC</div>
        <div onClick={() => navigate("/set-pin")}>🔐 Change PIN</div>
        <div onClick={() => navigate("/transactions/mini-statement")}>
          📄 Statements
        </div>
        <div onClick={() => navigate("/notifications")}>
          🔔 Notifications
        </div>

        {/* DARK MODE */}
        <div className="toggle-row">
          <span>🌙 Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className="slider" />
          </label>
        </div>

        <div onClick={() => navigate("/settings")}>⚙️ Settings</div>
        <div onClick={() => navigate("/security")}>
          🛡️ Privacy & Security
        </div>
      </div>

      {/* LOGOUT */}
      <div className="account-logout" onClick={logout}>
        🚪 Logout
      </div>
    </div>
  );
}
