import { useState } from "react";
import API from "../services/api";

export default function MiniStatement() {
  const [limit, setLimit] = useState(10);
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);

  const downloadStatement = async () => {
    try {
      setLoading(true);

      // ✅ FIXED ROUTE (MATCHES BACKEND)
      const response = await API.get(
        `/transaction/statement/${format}?limit=${limit}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `mini_statement.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Mini statement download error:", err);
      alert("Failed to download statement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Download Mini Statement</h2>

      <select value={limit} onChange={(e) => setLimit(e.target.value)}>
        <option value={5}>Last 5 transactions</option>
        <option value={10}>Last 10 transactions</option>
        <option value={20}>Last 20 transactions</option>
      </select>

      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="pdf">PDF</option>
        <option value="csv">CSV</option>
      </select>

      <button
        className="btn"
        onClick={downloadStatement}
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}
