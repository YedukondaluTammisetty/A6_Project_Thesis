import React from "react";

export default function SpendingInsights({ insights, onClick }) {
  if (!insights || insights.message) {
    return (
      <div
        className="card clickable"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <h3>Smart Insights 🧠</h3>
        <p className="muted">No spending insights yet</p>
        <p className="muted">Tap to view expense analytics</p>
      </div>
    );
  }

  return (
    <div
      className="card clickable"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h3>Smart Spending Insights 🧠</h3>

      <p>
        📊 Highest category:{" "}
        <b>{insights.topCategory.name}</b>{" "}
        (₹{insights.topCategory.amount})
      </p>

      <p>
        📅 Highest spending day:{" "}
        <b>{insights.topSpendingDay.day}</b>
      </p>

      <p className="muted" style={{ marginTop: "8px" }}>
        Click to view detailed insights →
      </p>
    </div>
  );
}
