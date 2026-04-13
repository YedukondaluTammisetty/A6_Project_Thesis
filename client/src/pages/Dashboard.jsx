import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import BalanceCard from "../components/BalanceCard";
import SavingsChart from "../components/SavingsChart";
import GoalsCard from "../components/GoalsCard";
import ExpenseChart from "../components/ExpenseChart";
import TransactionHistoryMini from "../components/TransactionHistoryMini";
import AccountMenu from "../components/AccountMenu";
import ChatBot from "../components/ChatBot";
import StatisticsSection from "../components/StatisticsSection";
import BudgetWidget from "../components/BudgetWidget";

import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [monthlySavings, setMonthlySavings] = useState([]);

  const [categories, setCategories] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [goal, setGoal] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const inc = await API.get("/income/current-month");
        const exp = await API.get("/transaction/expense/current-month");
        const cat = await API.get("/transaction/expenses/category");
        const sav = await API.get("/income/monthly-savings");
        const goalRes = await API.get("/goals");

        const monthlyIncome = inc?.data?.amount ?? 0;
        const monthlyExpense = exp?.data?.total ?? 0;

        const savings = monthlyIncome - monthlyExpense;

        setIncome(monthlyIncome);
        setExpense(monthlyExpense);
        setBalance(savings > 0 ? savings : 0);

        setMonthlySavings(sav?.data ?? []);

        setCategories(cat?.data?.map((c) => c._id) ?? []);
        setAmounts(cat?.data?.map((c) => c.totalAmount) ?? []);

        setGoal(goalRes?.data ?? null);

      } catch (err) {

        console.error("Dashboard load error", err);

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  /* ================= CLOSE MENU ================= */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const userInitial =
    localStorage.getItem("email")?.[0]?.toUpperCase() || "U";

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  return (

    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1>Dashboard</h1>

        <div className="header-right" ref={menuRef}>

          <span className="notification">🔔</span>

          <div
            className="avatar"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            {userInitial}
          </div>

          {showAccountMenu && (
            <AccountMenu onClose={() => setShowAccountMenu(false)} />
          )}

        </div>

      </div>

      {/* KPI */}
      <div className="kpi-grid">

        <BalanceCard
          balance={balance}
          income={income}
          expense={expense}
        />

        <SavingsChart monthlySavings={monthlySavings} />

        <GoalsCard goal={goal} />

      </div>

      {/* STATISTICS */}
      <div className="statistics-wrapper">

        <StatisticsSection />

      </div>

      {/* CHART + TRANSACTIONS */}
      <div className="middle-grid">

        <div className="expense-section">
          <ExpenseChart labels={categories} values={amounts} />
        </div>

        <div className="transactions-bottom">

          <h3>Transactions</h3>

          <TransactionHistoryMini limit={20} />

        </div>

      </div>

      {/* ACTIONS */}
      <div className="bottom-grid">

        <div className="card quick-actions-card">

          <h3>Quick Actions</h3>

          <div className="quick-actions">

            <div
              className="action-btn"
              onClick={() => navigate("/add-money")}
            >
              ➕ Add Money
            </div>

            <div
              className="action-btn"
              onClick={() =>
                navigate("/verify-pin", { state: { redirectTo: "/send" } })
              }
            >
              💸 Send Money
            </div>

            <div
              className="action-btn"
              onClick={() => navigate("/expenses/overview")}
            >
              📊 Analytics
            </div>

            <div
              className="action-btn"
              onClick={() => navigate("/set-pin")}
            >
              🔐 Security
            </div>

          </div>

        </div>

        <div className="card statement-card">

          <h3>Mini Statement</h3>

          <button
            className="primary-btn"
            onClick={() => navigate("/transactions/mini-statement")}
          >
            ⬇ Download Mini Statement
          </button>

        </div>

        <div className="card budget-card">

          <BudgetWidget category="Food" />

        </div>

      </div>

      <ChatBot />

    </div>

  );

}