import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/settings.css";

/* =====================================================
   OPTION SELECTOR (RADIO / MULTI-CHECK)
===================================================== */
function OptionSelector({ options, value, onChange, multiple }) {
  const handleClick = (option) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
    }
  };

  return (
    <div className="option-group">
      {options.map((opt) => {
        const active = multiple
          ? value.includes(opt)
          : value === opt;

        return (
          <div
            key={opt}
            className={`option-card ${active ? "active" : ""}`}
            onClick={() => handleClick(opt)}
          >
            <span className="option-indicator" />
            <span className="option-text">{opt}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Settings() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [page, setPage] = useState("main");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  /* ================= MONTHLY INCOME ================= */
  const [monthlyIncome, setMonthlyIncome] = useState("");

  /* =====================================================
     ANSWERS STATE
  ===================================================== */
  const [answers, setAnswers] = useState({
    gender: "",
    ageGroup: "",
    maritalStatus: "",
    education: "",
    livingWith: "",
    interests: [],
    house: "",
    car: "",
    bike: "",
    income: "",
    investments: []
  });

  /* ======================
     APPLY THEME
  ====================== */
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* =====================================================
     QUESTIONS
  ===================================================== */
  const additionalQuestions = [
    { key: "gender", title: "Which gender do you identify with?", options: ["Male", "Female", "Other"], multiple: false },
    { key: "ageGroup", title: "How old are you?", options: ["18–24", "25–34", "35–44", "45+"], multiple: false },
    { key: "maritalStatus", title: "What is your marital status?", options: ["Single", "Married", "Divorced"], multiple: false },
    { key: "education", title: "Education qualification", options: ["10th", "12th", "Graduate", "Post Graduate"], multiple: false },
    { key: "livingWith", title: "Who do you live with?", options: ["Family", "Alone", "Friends"], multiple: false },
    { key: "interests", title: "Your personal interests", options: ["Movies", "Travel", "Fitness", "Gaming", "Music"], multiple: true }
  ];

  const financialQuestions = [
    { key: "house", title: "House ownership", options: ["Owned", "Rented"], multiple: false },
    { key: "car", title: "Do you own a car?", options: ["Yes", "No"], multiple: false },
    { key: "bike", title: "Do you own a two-wheeler?", options: ["Yes", "No"], multiple: false },
    { key: "income", title: "Annual income", options: ["<5L", "5–10L", "10–25L", "25L+"], multiple: false },
    { key: "investments", title: "Where do you invest?", options: ["FD", "Mutual Funds", "Stocks", "Crypto"], multiple: true }
  ];

  /* =====================================================
     SAVE PREFERENCES
  ===================================================== */
  const savePreferences = async () => {
    try {
      setSaving(true);
      await API.post("/preferences/save", answers);
      alert("Preferences saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SAVE MONTHLY INCOME ================= */

  const saveIncome = async () => {

    try {

      await API.post("/income/set", {
        amount: Number(monthlyIncome)
      });

      alert("Monthly income saved");

    } catch (err) {

      console.error(err);
      alert("Failed to save income");

    }

  };

  /* =====================================================
     QUESTION FLOW PAGE
  ===================================================== */
  if (page !== "main") {

    const questions = page === "additional"
      ? additionalQuestions
      : financialQuestions;

    const q = questions[step];
    const value = answers[q.key];

    return (
      <div className="settings-page">
        <div className="settings-card">

          <button
            className="back-btn"
            onClick={() => {
              setPage("main");
              setStep(0);
            }}
          >
            ← Back
          </button>

          <div className="progress">
            Question {step + 1} of {questions.length}
          </div>

          <h2 className="question-title">{q.title}</h2>

          <OptionSelector
            options={q.options}
            value={value}
            multiple={q.multiple}
            onChange={(val) =>
              setAnswers((prev) => ({ ...prev, [q.key]: val }))
            }
          />

          <div className="question-actions">

            <button
              className="secondary-btn"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>

            <button
              className="primary-btn"
              disabled={q.multiple ? value.length === 0 : !value}
              onClick={() => {

                if (step + 1 === questions.length) {
                  savePreferences();
                  setPage("main");
                } else {
                  setStep(step + 1);
                }

              }}
            >
              {step + 1 === questions.length
                ? (saving ? "Saving..." : "Save")
                : "Next"}
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN SETTINGS PAGE
  ===================================================== */

  return (

    <div className="settings-page">

      <div className="settings-card">

        <h2>Settings</h2>
        <p className="subtitle">
          Manage your account preferences and data
        </p>

        {/* APPEARANCE */}
        <div className="settings-section">

          <h3>Appearance</h3>

          <div className="setting-row">

            <div>
              <div className="setting-title">Dark Mode</div>
              <div className="setting-desc">Reduce eye strain</div>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />

              <span className="slider" />

            </label>

          </div>

        </div>

        {/* PERSONAL DATA */}
        <div className="settings-section">

          <h3>Personal Data</h3>

          <div
            className="setting-row clickable"
            onClick={() => setPage("additional")}
          >

            <div>

              <div className="setting-title">
                Additional Details
              </div>

              <div className="setting-desc">
                Lifestyle & preferences
              </div>

            </div>

            <span className="arrow">›</span>

          </div>

          <div
            className="setting-row clickable"
            onClick={() => setPage("financial")}
          >

            <div>

              <div className="setting-title">
                Financial Details
              </div>

              <div className="setting-desc">
                Income, assets & investments
              </div>

            </div>

            <span className="arrow">›</span>

          </div>

        </div>

        {/* ⭐ MONTHLY INCOME FEATURE */}
        <div className="settings-section">

          <h3>Monthly Income</h3>

          <div className="setting-row">

            <div>

              <div className="setting-title">
                Set Monthly Income
              </div>

              <div className="setting-desc">
                Used for savings & analytics
              </div>

            </div>

          </div>

          <input
            type="number"
            placeholder="Enter monthly income"
            value={monthlyIncome}
            onChange={(e) =>
              setMonthlyIncome(e.target.value)
            }
          />

          <button
            className="primary-btn"
            onClick={saveIncome}
          >
            Save Income
          </button>

        </div>

      </div>

    </div>

  );

}