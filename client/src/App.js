import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===================== TOAST NOTIFICATIONS ===================== */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================== GLOBAL CHART SETUP ===================== */
import "./chartSetup";

/* ===================== STYLES ===================== */
import "./styles/theme.css";
import "./App.css";

/* ===================== COMPONENTS ===================== */
import Navbar from "./components/Navbar";

/* ===================== PAGES ===================== */
/* AUTH */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import NewPassword from "./pages/NewPassword";

/* DASHBOARD & CORE */
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import AddMoney from "./pages/AddMoney";
import Processing from "./pages/Processing";
import Success from "./pages/Success";

/* ⭐ NEW QR SCANNER PAGE */
import ScanQR from "./pages/ScanQR";

/* TRANSACTIONS */
import TransactionHistory from "./pages/TransactionHistory";
import MiniStatement from "./pages/MiniStatement";
import StatementSummary from "./pages/StatementSummary";

/* EXPENSES */
import ExpenseTracker from "./pages/ExpenseTracker";
import ExpenseOverview from "./pages/expense/ExpenseOverview";
import CategoryAnalytics from "./pages/expense/CategoryAnalytics";
import TimeAnalytics from "./pages/expense/TimeAnalytics";
import BehaviorAnalytics from "./pages/expense/BehaviorAnalytics";
import BudgetAnalytics from "./pages/expense/BudgetAnalytics";

/* ACCOUNT MENU */
import MyQR from "./pages/MyQR";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Security from "./pages/Security";

/* PIN */
import SetPin from "./pages/SetPin";
import VerifyPin from "./pages/VerifyPin";

/* RESET PIN */
import ForgotPin from "./pages/pin/ForgotPin";
import ResetPinOtp from "./pages/pin/ResetPinOtp";
import SetNewPin from "./pages/pin/SetNewPin";

/* =====================================================
   🔐 PRIVATE ROUTE (LOGIN REQUIRED)
===================================================== */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

/* =====================================================
   🌐 PUBLIC ROUTE (BLOCK WHEN LOGGED IN)
===================================================== */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* ================= AUTH ================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* ================= PASSWORD RESET ================= */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ================= TRANSACTIONS ================= */}
        <Route path="/send" element={<PrivateRoute><SendMoney /></PrivateRoute>} />

        {/* ⭐ QR SCANNER ROUTE */}
        <Route path="/scan" element={<PrivateRoute><ScanQR /></PrivateRoute>} />

        <Route path="/add-money" element={<PrivateRoute><AddMoney /></PrivateRoute>} />
        <Route path="/processing" element={<PrivateRoute><Processing /></PrivateRoute>} />
        <Route path="/success" element={<PrivateRoute><Success /></PrivateRoute>} />

        {/* ================= HISTORY & STATEMENTS ================= */}
        <Route path="/history" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />

        <Route
          path="/transactions/mini-statement"
          element={<PrivateRoute><MiniStatement /></PrivateRoute>}
        />

        <Route
          path="/transactions/summary"
          element={<PrivateRoute><StatementSummary /></PrivateRoute>}
        />

        {/* ================= ACCOUNT MENU ================= */}
        <Route path="/my-qr" element={<PrivateRoute><MyQR /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/security" element={<PrivateRoute><Security /></PrivateRoute>} />

        {/* ================= PIN ================= */}
        <Route path="/set-pin" element={<PrivateRoute><SetPin /></PrivateRoute>} />
        <Route path="/verify-pin" element={<PrivateRoute><VerifyPin /></PrivateRoute>} />

        {/* ================= RESET PIN ================= */}
        <Route path="/forgot-pin" element={<ForgotPin />} />
        <Route path="/reset-pin-otp" element={<ResetPinOtp />} />
        <Route path="/set-new-pin" element={<SetNewPin />} />

        {/* ================= EXPENSES ================= */}
        <Route path="/expenses" element={<PrivateRoute><ExpenseTracker /></PrivateRoute>} />
        <Route path="/expenses/overview" element={<PrivateRoute><ExpenseOverview /></PrivateRoute>} />
        <Route path="/expenses/category" element={<PrivateRoute><CategoryAnalytics /></PrivateRoute>} />
        <Route path="/expenses/time" element={<PrivateRoute><TimeAnalytics /></PrivateRoute>} />
        <Route path="/expenses/behavior" element={<PrivateRoute><BehaviorAnalytics /></PrivateRoute>} />
        <Route path="/expenses/budget" element={<PrivateRoute><BudgetAnalytics /></PrivateRoute>} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

      {/* ================= TOAST POPUP ================= */}
      <ToastContainer position="top-right" autoClose={3000} />

    </BrowserRouter>
  );
}

export default App;