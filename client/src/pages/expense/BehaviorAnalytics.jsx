import { useEffect, useState } from "react";
import API from "../../services/api";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

/* ======================
   CHART REGISTRATION
====================== */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function BehaviorAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH DAILY EXPENSES
  ====================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transaction/expenses/summary");
        setData(res.data || []);
      } catch (err) {
        console.error("Behavior analytics error:", err);
        setData([]);
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
          <h2>Spending Behavior</h2>
          <p>Loading analytics...</p>
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
          <h2>Spending Behavior</h2>
          <p>No spending data available</p>
        </div>
      </div>
    );
  }

  /* ======================
     CUMULATIVE DATA
  ====================== */
  let cumulative = 0;
  const labels = [];
  const cumulativeValues = [];

  data.forEach(item => {
    cumulative += item.totalAmount;
    labels.push(item._id);
    cumulativeValues.push(cumulative);
  });

  /* ======================
     CHART DATA
  ====================== */
  const chartData = {
    labels,
    datasets: [
      {
        label: "Cumulative Spending (₹)",
        data: cumulativeValues,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
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

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Spending Behavior 🧠</h2>

        <div className="card">
          <h3>Cumulative Expense Curve</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
