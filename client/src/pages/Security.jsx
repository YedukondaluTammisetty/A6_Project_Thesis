import { useState } from "react";
import "../styles/security.css";

export default function Security() {
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      alert("Account deactivation request submitted.");
    }
  };

  return (
    <div className="security-page">
      <div className="security-card">

        <h2>Privacy & Security</h2>
        <p className="subtitle">
          Manage your password, PIN, devices and account protection
        </p>

        {/* ================= PASSWORD ================= */}
        <div className="security-section">
          <h3>Login & Authentication</h3>

          <div className="security-row clickable">
            <div>
              <div className="title">Change Password</div>
              <div className="desc">Update your login password</div>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="security-row clickable">
            <div>
              <div className="title">Change Transaction PIN</div>
              <div className="desc">Update your secure payment PIN</div>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="security-row">
            <div>
              <div className="title">Two-Factor Authentication</div>
              <div className="desc">Extra protection for your account</div>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={twoFA}
                onChange={() => setTwoFA(!twoFA)}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="security-row">
            <div>
              <div className="title">Biometric Login</div>
              <div className="desc">Use fingerprint or Face ID</div>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={biometric}
                onChange={() => setBiometric(!biometric)}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        {/* ================= SESSIONS ================= */}
        <div className="security-section">
          <h3>Active Sessions</h3>

          <div className="device-card">
            <div>
              <div className="device-name">MacBook Pro - Chrome</div>
              <div className="device-info">Hyderabad • Active Now</div>
            </div>
            <button className="logout-btn">Logout</button>
          </div>

          <div className="device-card">
            <div>
              <div className="device-name">iPhone 14 - Safari</div>
              <div className="device-info">Mumbai • 2 days ago</div>
            </div>
            <button className="logout-btn outline">Logout</button>
          </div>
        </div>

        {/* ================= DATA & PRIVACY ================= */}
        <div className="security-section">
          <h3>Privacy Controls</h3>

          <div className="security-row clickable">
            <div>
              <div className="title">Download My Data</div>
              <div className="desc">Get a copy of your personal data</div>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="security-row clickable">
            <div>
              <div className="title">Manage Permissions</div>
              <div className="desc">Control app access & activity</div>
            </div>
            <span className="arrow">›</span>
          </div>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="security-section danger-zone">
          <h3>Danger Zone</h3>

          <button className="danger-btn" onClick={handleDeactivate}>
            Deactivate Account
          </button>
        </div>

      </div>
    </div>
  );
}
