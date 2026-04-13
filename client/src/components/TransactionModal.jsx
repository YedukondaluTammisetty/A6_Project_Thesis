import React from "react";

export default function TransactionModal({ tx, onClose }) {
  // 🛑 Safety: do not render if no transaction selected
  if (!tx) return null;

  // Close modal when clicking outside card
  const handleBackdropClick = (e) => {
    if (e.target.className === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">

        {/* HEADER */}
        <h3 style={{ marginBottom: "16px" }}>
          Transaction Details
        </h3>

        {/* DETAILS */}
        <div className="modal-row">
          <span>Transaction ID</span>
          <span>{tx._id}</span>
        </div>

        <div className="modal-row">
          <span>Type</span>
          <span>{tx.type.toUpperCase()}</span>
        </div>

        <div className="modal-row">
          <span>Amount</span>
          <span>₹ {tx.amount}</span>
        </div>

        <div className="modal-row">
          <span>Status</span>
          <span className={`status ${tx.status}`}>
            {tx.status.toUpperCase()}
          </span>
        </div>

        <div className="modal-row">
          <span>Sender</span>
          <span>{tx.senderMobile}</span>
        </div>

        <div className="modal-row">
          <span>Receiver</span>
          <span>{tx.receiverMobile}</span>
        </div>

        <div className="modal-row">
          <span>Date & Time</span>
          <span>{new Date(tx.createdAt).toLocaleString()}</span>
        </div>

        {/* RAZORPAY (ONLY IF EXISTS) */}
        {tx.razorpayPaymentId && (
          <div className="modal-row">
            <span>Razorpay Payment ID</span>
            <span>{tx.razorpayPaymentId}</span>
          </div>
        )}

        {/* FAILURE REASON */}
        {tx.status === "failed" && tx.failureReason && (
          <div className="modal-error">
            ❌ {tx.failureReason}
          </div>
        )}

        {/* ACTION */}
        <button className="btn" onClick={onClose} style={{ marginTop: "16px" }}>
          Close
        </button>

      </div>
    </div>
  );
}
