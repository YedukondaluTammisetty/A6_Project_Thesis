export default function QuickTransfer() {
  const users = ["A", "R", "S", "M"];

  return (
    <div className="dashboard-card">
      <h4>Quick Transfer</h4>

      <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
        {users.map(u => (
          <div
            key={u}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#6366f1",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            {u}
          </div>
        ))}
      </div>
    </div>
  );
}
