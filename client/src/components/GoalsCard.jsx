import { useEffect, useState } from "react";
import API from "../services/api";

export default function GoalsCard() {

  const [goal, setGoal] = useState(0);
  const [saved, setSaved] = useState(0);

  /* ⭐ INPUT FOR NEW TARGET */
  const [targetInput, setTargetInput] = useState("");

  /* ================= LOAD GOAL ================= */

  const loadGoal = async () => {

    try {

      const res = await API.get("/goals");

      const target = res?.data?.targetAmount ?? 0;
      const savedAmount = res?.data?.savedAmount ?? 0;

      setGoal(target);
      setSaved(savedAmount);

    } catch (err) {

      console.error("Goal load error", err);

    }

  };

  useEffect(() => {

    loadGoal();

  }, []);

  /* ================= SET NEW GOAL ================= */

  const setNewGoal = async () => {

    try {

      if (!targetInput) return;

      await API.post("/goals/set", {
        targetAmount: Number(targetInput)
      });

      setTargetInput("");

      loadGoal();

    } catch (err) {

      console.error("Goal set error", err);

    }

  };

  /* ================= RESET GOAL ================= */

  const resetGoal = async () => {

    try {

      await API.post("/goals/set", {
        targetAmount: goal
      });

      await API.post("/goals/add-savings", {
        amount: -saved
      });

      loadGoal();

    } catch (err) {

      console.error("Goal reset error", err);

    }

  };

  const percent =
    goal > 0 ? Math.min(100, Math.round((saved / goal) * 100)) : 0;

  return (

    <div className="kpi-card goals-kpi">

      <p className="kpi-title">Goals</p>

      <h3>Vacation Fund</h3>

      <div className="goal-progress">
        <div style={{ width: `${percent}%` }} />
      </div>

      <p className="goal-text">{percent}% Reached</p>

      <p className="muted">
        ₹ {saved} saved of ₹ {goal}
      </p>

      {/* ================= SET TARGET ================= */}

      <div style={{ marginTop: "10px" }}>

        <input
          type="number"
          placeholder="Set new goal amount"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          style={{ width: "120px", marginRight: "6px" }}
        />

        <button onClick={setNewGoal}>
          Set
        </button>

      </div>

      {/* ================= RESET BUTTON ================= */}

      {percent >= 100 && (

        <button
          style={{ marginTop: "10px" }}
          onClick={resetGoal}
        >
          Reset Goal
        </button>

      )}

    </div>

  );

}