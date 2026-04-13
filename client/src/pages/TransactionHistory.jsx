import { useEffect, useState } from "react";
import API from "../services/api";
import TransactionModal from "../components/TransactionModal";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD TRANSACTION HISTORY
  ====================== */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await API.get("/transaction/history");
        setTransactions(res.data);
      } catch (err) {
        alert("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h2>Transaction History 📜</h2>

        <div className="table-container">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>To / From</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const dateObj = new Date(tx.createdAt);

                  return (
                    <tr
                      key={tx._id}
                      onClick={() => setSelectedTx(tx)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{dateObj.toLocaleDateString()}</td>
                      <td>{dateObj.toLocaleTimeString()}</td>

                      <td>
                        {tx.type === "debit"
                          ? `To ${tx.receiverMobile}`
                          : `From ${tx.senderMobile}`}
                      </td>

                      <td className={tx.type === "debit" ? "debit" : "credit"}>
                        {tx.type.toUpperCase()}
                      </td>

                      <td>
                        <span className="category-badge">
                          {tx.category || "Others"}
                        </span>
                      </td>

                      <td>₹ {tx.amount}</td>

                      <td>
                        <span className={`status ${tx.status}`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================
         TRANSACTION DETAILS MODAL
      ====================== */}
      {selectedTx && (
        <TransactionModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
