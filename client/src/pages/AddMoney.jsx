import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

export default function AddMoney() {

  const navigate = useNavigate();
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const mobile = localStorage.getItem("mobile"); // ⭐ IMPORTANT

  /* ======================
     PIN CHECK
  ====================== */
  useEffect(() => {

    const pinVerified = sessionStorage.getItem("pinVerified");

    if (!pinVerified) {
      navigate("/verify-pin", {
        state: { redirectTo: location.pathname }
      });
    }

  }, [navigate, location]);



  /* ======================
     ADD MONEY
  ====================== */

  const addMoney = async () => {

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {

      setLoading(true);

      /* CREATE ORDER */

      const { data: order } = await API.post("/payment/create-order", {
        amount: Number(amount)
      });


      const options = {

        key: "rzp_test_S6xPtKCoI13gNb",
        amount: order.amount,
        currency: "INR",
        name: "TransactPro",
        description: "Add Money to Wallet",
        order_id: order.id,


        handler: async function (response) {

          try {

            await API.post("/payment/verify", {

              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              mobile: mobile,        // ⭐ IMPORTANT FIX
              amount: Number(amount)

            });

            alert("Money added successfully 💸");

            navigate("/dashboard");

          }

          catch (err) {

            console.error(err);

            alert("Payment verification failed");

          }

        },


        theme: {
          color: "#4f46e5"
        }

      };


      const rzp = new window.Razorpay(options);

      rzp.open();

    }

    catch (err) {

      console.error("Add money error:", err);

      alert("Failed to initiate payment");

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div className="card">

      <h2>Add Money 💰</h2>

      <input
        type="number"
        placeholder="Enter amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
      />

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>

        <button className="btn" onClick={addMoney} disabled={loading}>
          {loading ? "Processing..." : `Add ₹${amount || ""}`}
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