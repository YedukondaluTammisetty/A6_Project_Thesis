import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { speakAlert } from "../utils/voiceAlert";

export default function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();

  const [receiverMobile, setReceiverMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     📲 AUTO FILL RECEIVER MOBILE FROM QR SCAN
  ===================================================== */
  useEffect(() => {
    if (location.state?.receiverMobile) {
      setReceiverMobile(location.state.receiverMobile);
    }
  }, [location]);

  /* =====================================================
     📊 CHECK CATEGORY BUDGET (ALERT ONLY ONCE PER MONTH)
  ===================================================== */
  const checkBudget = async (categoryName) => {
    try {

      const res = await API.get(`/budget/usage/${categoryName}`);
      const percentage = Number(res.data.percentage);

      const now = new Date();
      const monthKey = `${now.getFullYear()}_${now.getMonth()}`;

      const alert50Key = `alert50_${categoryName}_${monthKey}`;
      const alert80Key = `alert80_${categoryName}_${monthKey}`;
      const alert100Key = `alert100_${categoryName}_${monthKey}`;

      const alert50 = localStorage.getItem(alert50Key);
      const alert80 = localStorage.getItem(alert80Key);
      const alert100 = localStorage.getItem(alert100Key);

      if (percentage >= 50 && percentage < 80 && !alert50) {

        speakAlert(`You used 50 percent of your ${categoryName} budget`);
        localStorage.setItem(alert50Key, "true");

      }

      else if (percentage >= 80 && percentage < 100 && !alert80) {

        speakAlert(`Warning. You used 80 percent of your ${categoryName} budget`);
        localStorage.setItem(alert80Key, "true");

      }

      else if (percentage >= 100 && !alert100) {

        speakAlert(`You crossed your ${categoryName} budget limit`);
        localStorage.setItem(alert100Key, "true");

      }

    } catch (err) {

      console.log("Budget check failed");

    }
  };

  /* =====================================================
     🔐 REQUIRE PIN VERIFICATION (SESSION BASED)
  ===================================================== */
  useEffect(() => {
    const pinVerified = sessionStorage.getItem("pinVerified");

    if (!pinVerified) {
      navigate("/verify-pin", {
        replace: true,
        state: { redirectTo: location.pathname }
      });
    }
  }, [navigate, location.pathname]);

  /* =====================================================
     💸 SEND MONEY
  ===================================================== */
  const sendMoney = async () => {

    if (receiverMobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {

      setLoading(true);

      await API.post("/transaction/send", {
        receiverMobile: receiverMobile.trim(),
        amount: Number(amount),
        category,
        note
      });

      /* 🔥 CHECK BUDGET AFTER TRANSACTION */
      await checkBudget(category);

      /* 🔊 MONEY SENT VOICE */
      speakAlert(`Money sent successfully`);

      // ✅ Clear PIN verification after successful transaction
      sessionStorage.removeItem("pinVerified");

      // ✅ Go to success page
      navigate("/success", { state: { amount } });

    } catch (err) {

      console.error("Send money error:", err);
      alert(err.response?.data?.error || "Money transfer failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="card">

      <h2>Send Money 💸</h2>

      {/* 📱 RECEIVER MOBILE */}
      <input
        type="text"
        inputMode="numeric"
        placeholder="Receiver Mobile Number"
        value={receiverMobile}
        maxLength={10}
        onChange={(e) =>
          setReceiverMobile(e.target.value.replace(/\D/g, ""))
        }
      />

      {/* 💰 AMOUNT */}
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* 🏷 CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="select"
      >
        <option value="Food">🍔 Food</option>
        <option value="Rent">🏠 Rent</option>
        <option value="Travel">✈️ Travel</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Education">📚 Education</option>
        <option value="Medical">🏥 Medical</option>
        <option value="Utilities">💡 Utilities</option>
        <option value="Entertainment">🎬 Entertainment</option>
        <option value="Transfer">💸 Transfer</option>
        <option value="Others">📦 Others</option>
      </select>

      {/* 📝 NOTE */}
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        maxLength={100}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* 🔘 ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button className="btn" onClick={sendMoney} disabled={loading}>
          {loading ? "Processing..." : "Pay"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}