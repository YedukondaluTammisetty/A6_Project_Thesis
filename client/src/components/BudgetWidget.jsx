import { useEffect, useState } from "react";
import API from "../services/api";

export default function BudgetWidget() {

  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [budget, setBudget] = useState(null);

  const categories = [
    "Food",
    "Rent",
    "Travel",
    "Shopping",
    "Education",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transfer",
    "Others"
  ];

  /* ==========================
     LOAD BUDGET DATA
  ========================== */
  useEffect(() => {

    const loadBudget = async () => {
      try {

        const res = await API.get(`/budget/usage/${category}`);
        setBudget(res.data);

        // existing limit input lo show cheyyadaniki
        if (res.data.limit) {
          setLimit(res.data.limit);
        }

      } catch (err) {
        console.log("Failed to load budget");
      }
    };

    loadBudget();

  }, [category]);

  /* ==========================
     SAVE / UPDATE LIMIT
  ========================== */
  const saveLimit = async () => {

    if (!limit || Number(limit) <= 0) {
      alert("Please enter a valid limit");
      return;
    }

    try {

      await API.post("/budget/set-budget", {
        category,
        limit: Number(limit)
      });

      const res = await API.get(`/budget/usage/${category}`);
      setBudget(res.data);

      alert("Budget limit updated");

    } catch (err) {

      console.log("Failed to save limit");

    }

  };

  if (!budget) return null;

  const percentage = Number(budget.percentage) || 0;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "16px",
        background: "#f7f7f7",
        borderRadius: "10px"
      }}
    >

      <h3>📊 Smart Spending Alert</h3>

      {/* CATEGORY SELECT */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "8px",
          marginTop: "8px",
          width: "100%"
        }}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* SET / UPDATE LIMIT */}
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        <input
          type="number"
          placeholder="Set limit ₹"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />

        <button
          onClick={saveLimit}
          style={{
            padding: "8px 12px",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {budget.limit ? "Update" : "Save"}
        </button>
      </div>

      {/* SHOW LIMIT INFO */}
      {budget.limit > 0 && (
        <>
          <p style={{ marginTop: "10px" }}>
            <b>Limit:</b> ₹{budget.limit}
          </p>

          <p>
            <b>Spent:</b> ₹{budget.spent}
          </p>

          <p>
            <b>Usage:</b> {percentage}%
          </p>

          {/* PROGRESS BAR */}
          <div
            style={{
              height: "12px",
              background: "#ddd",
              borderRadius: "8px",
              overflow: "hidden",
              marginTop: "8px"
            }}
          >
            <div
              style={{
                width: `${Math.min(percentage, 100)}%`,
                height: "100%",
                background:
                  percentage < 50
                    ? "#4caf50"
                    : percentage < 80
                    ? "#ff9800"
                    : "#f44336"
              }}
            />
          </div>

          {percentage >= 100 && (
            <p style={{ color: "red", marginTop: "8px" }}>
              ⚠ Budget exceeded!
            </p>
          )}
        </>
      )}

    </div>
  );
}