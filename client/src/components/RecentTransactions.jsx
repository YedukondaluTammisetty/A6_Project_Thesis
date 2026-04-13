import { useEffect, useState } from "react";
import API from "../services/api";

export default function RecentTransactions({ onClick }) {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    API.get("/transaction/history").then(res => {
      setTxns(res.data.slice(0, 5));
    });
  }, []);

  return (
    <div className="dashboard-card" onClick={onClick}>
      <h4>Recent Transactions</h4>

      {txns.map(tx => (
        <div
          key={tx._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12
          }}
        >
          <span>{tx.category}</span>
          <span className={tx.type === "debit" ? "debit" : "credit"}>
            ₹ {tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
