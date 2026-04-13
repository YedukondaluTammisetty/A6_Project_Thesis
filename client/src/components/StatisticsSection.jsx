import { Bar } from "react-chartjs-2";

export default function StatisticsSection() {

  const data = {
    labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
    datasets: [
      {
        label: "Expense",
        data: [23, 28, 30, 27, 22, 18, 15],
        backgroundColor: "#ff6b6b",
        hoverBackgroundColor: "#ff5252",
        borderRadius: 8,
        barThickness: 28
      },
      {
        label: "Income",
        data: [38, 30, 55, 35, 40, 25, 20],
        backgroundColor: "#6366f1",
        hoverBackgroundColor: "#4f46e5",
        borderRadius: 8,
        barThickness: 28
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 14,
          usePointStyle: true,
          color: "#374151",
          font: {
            size: 13,
            weight: "600"
          }
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          font: { weight: "500" }
        }
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#6b7280"
        }
      }
    }
  };

  return (
    <div className="statistics-section">
      <div className="stats-header">
        <h3>Statistics</h3>
        <select>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="stats-chart">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}