import { Line } from "react-chartjs-2";

export default function SavingsChart({ monthlySavings = [] }) {

  const now = new Date();
  const months = [];

  for (let i = 3; i >= 0; i--) {

    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push(
      d.toLocaleString("default", { month: "short" })
    );

  }

  /* ===============================
     ENSURE DATA ALWAYS HAS 4 VALUES
  =============================== */

  const savingsData = [...monthlySavings];

  while (savingsData.length < 4) {
    savingsData.unshift(0);
  }

  const data = {

    labels: months,

    datasets: [
      {
        label: "Savings",

        data: savingsData,

        borderColor: "#3b82f6",

        backgroundColor: "rgba(59,130,246,0.15)",

        fill: true,

        tension: 0.4,

        pointRadius: 4
      }
    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: { display: false }
    },

    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { color: "#f1f5f9" },
        beginAtZero: true
      }
    }

  };

  return (

    <div className="kpi-card savings-kpi">

      <div className="kpi-top">

        <p className="kpi-title">Total Savings</p>

        <span className="trend-pill blue">↑ 1.50%</span>

      </div>

      <div
        className="mini-chart"
        style={{ height: "120px" }}
      >

        <Line data={data} options={options} />

      </div>

    </div>

  );

}