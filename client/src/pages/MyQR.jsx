import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/myqr.css";

export default function MyQR() {
  const [qrValue, setQrValue] = useState("");

  const email = localStorage.getItem("email");
  const mobile = localStorage.getItem("mobile");

  const name =
    email?.split("@")[0]?.replace(/[^a-zA-Z]/g, "") || "User";

  /* ===============================
     GENERATE APP PAYMENT QR
     (USED INSIDE TRANSACTPRO APP)
  ================================ */
  useEffect(() => {
    if (!mobile) return;

    // Custom QR format for our app
    const appQR = `transactpro://pay?mobile=${mobile}&name=${encodeURIComponent(
      name
    )}`;

    setQrValue(appQR);
  }, [name, mobile]);

  return (
    <div className="qr-page">
      <div className="qr-card">
        <h2>My QR Code</h2>
        <p className="qr-subtitle">
          Scan this QR in TransactPro to send money
        </p>

        {/* QR CODE */}
        <div className="qr-box">
          {qrValue && (
            <QRCodeCanvas
              value={qrValue}
              size={220}
              bgColor="#ffffff"
              fgColor="#111827"
              level="H"
              includeMargin
            />
          )}
        </div>

        {/* USER DETAILS */}
        <div className="qr-details">
          <div className="qr-name">{name}</div>
          <div className="qr-mobile">+91 {mobile}</div>
          <div className="qr-app">TransactPro QR</div>
        </div>

        {/* INFO */}
        <div className="qr-info">
          Scan using TransactPro scanner to pay instantly.
        </div>
      </div>
    </div>
  );
}