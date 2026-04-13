import { Bar } from "react-chartjs-2";

export default function WeeklyStatsChart() {
  const data = {
    labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
    datasets: [
      {
        label: "Income",
        data: [500,600,700,400,800,300,900],
        backgroundColor: "#c4b5fd"
      },
      {
        label: "Expense",
        data: [300,500,600,700,400,600,500],
        backgroundColor: "#fca5a5"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  };

  return (
    <div className="chart-wrapper">
      <p className="label">Statistics</p>
      <Bar data={data} options={options} />
    </div>
  );
}