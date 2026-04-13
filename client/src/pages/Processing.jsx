import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {

  const navigate = useNavigate();

  useEffect(() => {

    setTimeout(() => {
      navigate("/success");
    }, 2500);

  }, [navigate]);

  return (

    <div className="processing-container">

      {/* COIN */}
      <div className="coin">
        💰
      </div>

      <h2>Processing Payment...</h2>
      <p>Please wait. Do not refresh.</p>

    </div>
  );
}
