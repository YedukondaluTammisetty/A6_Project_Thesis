import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

/* ======================
   REGISTER CHART.JS
====================== */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
);

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH EXPENSE SUMMARY
  ====================== */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get("/transaction/expenses/summary");

        // Backend format:
        // { _id: "2026-02-01", totalAmount: 500 }
        const formatted = res.data.map(item => ({
          date: item._id,
          amount: item.totalAmount
        }));

        setExpenses(formatted);
      } catch (err) {
        console.error("Expense fetch error:", err);
        alert("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Expense Tracker 📊</h2>
          <p>Loading expense data...</p>
        </div>
      </div>
    );
  }

  /* ======================
     EMPTY STATE
  ====================== */
  if (!expenses.length) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Expense Tracker 📊</h2>
          <p>No expense data available</p>
        </div>
      </div>
    );
  }

  /* ======================
     DATA PREPARATION
  ====================== */
  const labels = expenses.map(e => e.date);
  const values = expenses.map(e => e.amount);

  /* ======================
     BAR & LINE DATA
  ====================== */
  const trendData = {
    labels,
    datasets: [
      {
        label: "Daily Expenses (₹)",
        data: values,
        backgroundColor: "#6366f1",
        borderColor: "#4f46e5",
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 4,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: ctx => `₹ ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: value => `₹ ${value}`
        }
      }
    }
  };

  /* ======================
     PIE DATA
  ====================== */
  const totalSpent = values.reduce((a, b) => a + b, 0);
  const avgPerDay = Math.round(totalSpent / values.length);

  const pieData = {
    labels: ["Total Spent", "Average / Day"],
    datasets: [
      {
        data: [totalSpent, avgPerDay],
        backgroundColor: ["#ef4444", "#22c55e"]
      }
    ]
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Expense Tracker 📊</h2>

        {/* BAR CHART */}
        <div className="card">
          <h3>Daily Expenses</h3>
          <Bar data={trendData} options={chartOptions} />
        </div>

        {/* LINE CHART */}
        <div className="card">
          <h3>Spending Trend</h3>
          <Line data={trendData} options={chartOptions} />
        </div>

        {/* PIE CHART */}
        <div className="card">
          <h3>Expense Overview</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
