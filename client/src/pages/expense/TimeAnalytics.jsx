import { useEffect, useState } from "react";
import API from "../../services/api";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

/* ======================
   CHART REGISTRATION
====================== */
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend
);

export default function TimeAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transaction/expenses/summary");
        setData(res.data);
      } catch (err) {
        console.error("Time analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Time-based Analytics</h2>
          <p>Loading time series data...</p>
        </div>
      </div>
    );
  }

  /* ======================
     EMPTY STATE
  ====================== */
  if (!data.length) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Time-based Analytics</h2>
          <p>No expense data available</p>
        </div>
      </div>
    );
  }

  /* ======================
     DATA PREP
  ====================== */
  const labels = data.map(d => d._id);
  const values = data.map(d => d.totalAmount);

  /* ======================
     LINE CHART
  ====================== */
  const lineData = {
    labels,
    datasets: [
      {
        label: "Daily Expense (₹)",
        data: values,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  /* ======================
     BAR CHART
  ====================== */
  const barData = {
    labels,
    datasets: [
      {
        label: "Daily Spend (₹)",
        data: values,
        backgroundColor: "#6366f1"
      }
    ]
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Time-based Analytics ⏱</h2>

        {/* LINE CHART */}
        <div className="card">
          <h3>Daily Expense Trend</h3>
          <Line data={lineData} />
        </div>

        {/* BAR CHART */}
        <div className="card">
          <h3>Daily Expense Distribution</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
