import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({
  labels = [],
  values = [],
  title = "Expense Breakdown"
}) {

  const total = values.reduce((a, b) => a + b, 0);

  const pastelColors = [
    "#7C83FD",
    "#80ED99",
    "#FFB703",
    "#F28482",
    "#C77DFF",
    "#48CAE4",
    "#FF8FAB",
    "#9EF01A"
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: pastelColors,
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 13,
            weight: "500"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.raw;
            const percent = total
              ? ((value / total) * 100).toFixed(1)
              : 0;
            return ` ₹${value} (${percent}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>

      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>
          {title}
        </h2>
      </div>

      {/* DONUT CENTER TOTAL */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none"
        }}
      >
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Total Spent
        </div>

        <div style={{ fontSize: 22, fontWeight: 700 }}>
          ₹ {total}
        </div>
      </div>

      {/* CHART */}
      <div style={{ height: 260 }}>
        {values.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
              fontWeight: 500
            }}
          >
            No expense data yet
          </div>
        )}
      </div>

    </div>
  );
}