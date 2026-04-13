import React from "react";

export default function BalanceCard({ balance = 0, income = 0, expense = 0 }) {
  return (
    <div className="kpi-card balance-kpi">
      <div className="kpi-top">
        <p className="kpi-title">Total Balance</p>
        <span className="trend-pill">↑ 2.35%</span>
      </div>

      <h2 className="kpi-amount">₹ {balance}</h2>

      <div className="kpi-bottom">
        <div>
          <p className="muted">Income</p>
          <strong>₹ {income}</strong>
        </div>

        <div className="divider" />

        <div>
          <p className="muted">Expense</p>
          <strong>₹ {expense}</strong>
        </div>
      </div>
    </div>
  );
}