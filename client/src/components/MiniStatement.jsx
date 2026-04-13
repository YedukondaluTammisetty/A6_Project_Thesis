import { useEffect, useState } from "react";
import API from "../services/api";

export default function MiniStatement() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    API.get("/transaction/history").then(res => setTxns(res.data));
  }, []);

  return (
    <div className="card">
      <h3>Mini Statement</h3>
      {txns.slice(0,5).map(t => (
        <p key={t._id}>{t.type} ₹{t.amount}</p>
      ))}
    </div>
  );
}