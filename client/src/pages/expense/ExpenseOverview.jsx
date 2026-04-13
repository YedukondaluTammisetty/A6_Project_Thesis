import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

import { Pie, Line } from "react-chartjs-2";

/* Register chart components */
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function ExpenseOverview() {
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryRes = await API.get("/transaction/expenses/category");
        const dailyRes = await API.get("/transaction/expenses/summary");

        setCategoryData(categoryRes.data || []);
        setDailyData(dailyRes.data || []);
      } catch (err) {
        console.error("Expense overview error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (!categoryData.length && !dailyData.length) {
    return <p>No expense data available</p>;
  }

  /* ================= TOTAL CALCULATION ================= */
  const totalSpent = categoryData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  /* ================= PIE DATA ================= */
  const pieData = {
    labels: categoryData.map((c) => c._id),
    datasets: [
      {
        data: categoryData.map((c) => c.totalAmount),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#06b6d4",
          "#a855f7",
          "#84cc16",
          "#f97316"
        ],
        borderWidth: 0
      }
    ]
  };

  /* ================= PIE OPTIONS ================= */
  const pieOptions = {
    cutout: "65%", // donut style
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ₹${context.raw}`;
          }
        }
      }
    }
  };

  /* ================= LINE DATA ================= */
  const lineData = {
    labels: dailyData.map((d) => d._id),
    datasets: [
      {
        label: "Daily Spend (₹)",
        data: dailyData.map((d) => d.totalAmount),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.15)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: true
      }
    }
  };

  /* ================= UI ================= */
  return (
    <div>

      {/* CATEGORY PIE */}
      <div style={{ position: "relative", height: "320px" }}>
        <Pie data={pieData} options={pieOptions} />

        {/* TOTAL CENTER TEXT */}
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Total Spent
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827"
            }}
          >
            ₹ {totalSpent}
          </div>
        </div>
      </div>

      {/* DAILY LINE CHART */}
      <div style={{ marginTop: "30px" }}>
        <Line data={lineData} options={lineOptions} />
      </div>

    </div>
  );
}