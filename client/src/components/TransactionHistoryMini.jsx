import { useEffect, useState } from "react";
import API from "../services/api";

export default function TransactionHistoryMini({ limit = 6 }) {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    API.get("/transaction/history").then(res =>
      setTxns(res.data.slice(0, limit))
    );
  }, [limit]);

  const download = async () => {
    const res = await API.get("/transaction/statement/pdf", {
      responseType: "blob"
    });

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Mini_Statement.pdf";
    a.click();
  };

  return (
    <div className="card side-card">
      <h3>Transactions</h3>

      {txns.map(tx => (
        <div key={tx._id} className="txn-row">
          <span>{tx.category}</span>
          <span className={tx.type}>{tx.amount}</span>
        </div>
      ))}

      <button className="btn small" onClick={download}>
        📄 Mini Statement
      </button>
    </div>
  );
}
