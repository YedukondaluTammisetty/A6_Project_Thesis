import { useEffect, useState } from "react";
import API from "../../services/api";

/* ===================== CHART.JS SETUP ===================== */
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

/* Register required components */
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function CategoryAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get(
          "/transaction/expenses/category"
        );
        setData(res.data || []);
      } catch (err) {
        console.error("Category analytics error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ===================== STATES ===================== */
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Category-wise Analytics</h2>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Category-wise Analytics</h2>
          <p>No expense data available</p>
        </div>
      </div>
    );
  }

  /* ===================== CHART DATA ===================== */
  const labels = data.map((d) => d._id);
  const values = data.map((d) => d.totalAmount);

  const barData = {
    labels,
    datasets: [
      {
        label: "Total Expense (₹)",
        data: values,
        backgroundColor: "#6366f1",
        borderRadius: 8
      }
    ]
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#06b6d4",
          "#a855f7",
          "#ec4899",
          "#84cc16"
        ]
      }
    ]
  };

  /* ===================== UI ===================== */
  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Category-wise Analytics 🧩</h2>

        <div className="card">
          <h3>Category Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div className="card" style={{ marginTop: "24px" }}>
          <h3>Category Comparison</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
