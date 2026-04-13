import { useEffect, useState } from "react";
import API from "../../services/api";
import { Bar } from "react-chartjs-2";

export default function BudgetAnalytics() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH PREDICTION
  ====================== */
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await API.get("/transaction/predict-balance");
        setPrediction(res.data);
      } catch (err) {
        console.error("Budget analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard">
          <h2>Budget & Forecast</h2>
          <p>Analyzing spending pattern...</p>
        </div>
      </div>
    );
  }

  /* ======================
     FALLBACK DATA (SAFETY)
  ====================== */
  const dailyBurnRate = prediction?.dailyBurnRate ?? 0;
  const daysLeft = prediction?.daysLeft ?? "∞";
  const warning = prediction?.warning ?? false;

  /* ======================
     CHART DATA (ALWAYS)
  ====================== */
  const data = {
    labels: ["Daily Burn Rate"],
    datasets: [
      {
        label: "₹ per day",
        data: [dailyBurnRate],
        backgroundColor: warning ? "#ef4444" : "#22c55e"
      }
    ]
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Budget & Forecast 🎯</h2>

        {/* ================= HEALTH MESSAGE ================= */}
        {!warning && (
          <div className="card success">
            <h3>Financial Health 🎉</h3>
            <p>Your current spending is sustainable.</p>
          </div>
        )}

        {/* ================= CHART (ALWAYS VISIBLE) ================= */}
        <div className="card">
          <h3>Daily Burn Rate</h3>
          <Bar data={data} />

          <div style={{ marginTop: 12 }}>
            <p>
              💸 Average spend per day: <b>₹ {dailyBurnRate}</b>
            </p>
            <p>
              ⏳ Wallet may last <b>{daysLeft}</b> days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
