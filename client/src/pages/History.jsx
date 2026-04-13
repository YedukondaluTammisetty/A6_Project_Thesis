import { useEffect, useState } from "react";
import API from "../services/api";
import TransactionModal from "../components/TransactionModal";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/transaction/history");
      setTransactions(res.data);
    } catch {
      alert("Failed to load history");
    }
  };

  const statusColor = (status) => {
    if (status === "success") return "#16a34a";
    if (status === "pending") return "#ca8a04";
    return "#dc2626";
  };

  return (
    <div className="dashboard-page">
      {/* TOP BAR */}
      <div className="topbar">
        <h3>Transaction History</h3>
      </div>

      <div className="dashboard">
        {transactions.length === 0 && (
          <p style={{ color: "#6b7280" }}>No transactions yet</p>
        )}

        {transactions.map((tx) => (
          <div
            key={tx._id}
            onClick={() => setSelectedTx(tx)}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              cursor: "pointer"
            }}
          >
            {/* LEFT */}
            <div>
              <div style={{ fontWeight: 600 }}>
                {tx.type === "credit" ? "Received" : "Paid"}
              </div>

              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                {new Date(tx.createdAt).toLocaleString()}
              </div>

              <div style={{ fontSize: "13px", marginTop: 4 }}>
                {tx.type === "credit"
                  ? `From ${tx.senderMobile}`
                  : `To ${tx.receiverMobile}`}
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: 700,
                  color: tx.type === "credit" ? "#16a34a" : "#dc2626"
                }}
              >
                {tx.type === "credit" ? "+" : "-"} ₹{tx.amount}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  marginTop: 6,
                  color: statusColor(tx.status),
                  fontWeight: 600
                }}
              >
                ● {tx.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      <TransactionModal
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
