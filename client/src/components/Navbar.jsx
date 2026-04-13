import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/transactpro.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ======================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ======================
     ACTIVE STATE
  ====================== */
  const isActive = (path) => {
    if (path.startsWith("/expenses")) {
      return location.pathname.startsWith("/expenses")
        ? "sidebar-active"
        : "";
    }

    return location.pathname === path ? "sidebar-active" : "";
  };

  return (
    <aside className="sidebar">

      {/* ================= LOGO ================= */}
      <div
        className="sidebar-logo"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img
          src={logo}
          alt="TransactPro"
          className="sidebar-brand-logo"
        />
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="sidebar-section">
        <p>ACCOUNT</p>

        <button
          className={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className={isActive("/history")}
          onClick={() => navigate("/history")}
        >
          Transaction History
        </button>
      </div>

      {/* ================= PAYMENTS ================= */}
      <div className="sidebar-section">
        <p>PAYMENTS</p>

        <button
          className={isActive("/send")}
          onClick={() => navigate("/send")}
        >
          Send Money
        </button>

        <button
          className={isActive("/add-money")}
          onClick={() => navigate("/add-money")}
        >
          Add Money
        </button>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="sidebar-section">
        <p>ANALYTICS</p>

        <button
          className={isActive("/expenses")}
          onClick={() => navigate("/expenses/overview")}
        >
          📊 Expense Overview
        </button>

        <button
          className={isActive("/expenses/category")}
          onClick={() => navigate("/expenses/category")}
        >
          🧩 Category Analytics
        </button>

        <button
          className={isActive("/expenses/time")}
          onClick={() => navigate("/expenses/time")}
        >
          ⏱ Time Analytics
        </button>

        <button
          className={isActive("/expenses/behavior")}
          onClick={() => navigate("/expenses/behavior")}
        >
          🧠 Spending Behavior
        </button>

        <button
          className={isActive("/expenses/budget")}
          onClick={() => navigate("/expenses/budget")}
        >
          🎯 Budget Analytics
        </button>
      </div>

      {/* ================= SECURITY ================= */}
      <div className="sidebar-section">
        <p>SECURITY</p>

        <button
          className={isActive("/set-pin")}
          onClick={() => navigate("/set-pin")}
        >
          🔐 Set / Change PIN
        </button>
      </div>

      {/* ================= LOGOUT ================= */}
      <div className="sidebar-section bottom">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

    </aside>
  );
}