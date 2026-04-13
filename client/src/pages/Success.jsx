import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Success() {

  const navigate = useNavigate();
  const location = useLocation();

  /* amount ni previous page nundi receive cheyyadam */
  const amount = location.state?.amount || "";

  useEffect(() => {

    /* success sound */
    const audio = new Audio("/payment-success.mp3");
    audio.volume = 0.4;
    audio.play().catch(()=>{});

    /* voice confirmation */
    if(amount){
      const message = new SpeechSynthesisUtterance(
        `Payment successful. Rupees ${amount} sent successfully`
      );

      message.rate = 1;
      message.pitch = 1;
      message.volume = 1;

      window.speechSynthesis.speak(message);
    }

  }, [amount]);

  return (
    <div className="card" style={{ textAlign: "center" }}>

      {/* animated success icon */}
      <div className="success-icon">
        ✅
      </div>

      <h1 style={{ color: "green" }}>
        Payment Successful
      </h1>

      <p style={{ fontSize:"18px", fontWeight:"600" }}>
        ₹{amount} Sent Successfully
      </p>

      <div style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "10px"
      }}>

        <button
          className="btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>

        <button
          className="btn"
          style={{ background: "#555" }}
          onClick={() => navigate("/send")}
        >
          Send More Money
        </button>

      </div>
    </div>
  );
}