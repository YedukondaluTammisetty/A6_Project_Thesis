import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

export default function ScanQR() {

  const navigate = useNavigate();

  const handleScan = (result) => {

    if (!result) return;

    try {

      const url = new URL(result?.text);

      const mobile = url.searchParams.get("mobile");

      if (mobile) {

        navigate("/send", {
          state: { receiverMobile: mobile }
        });

      }

    } catch (err) {
      console.log("Invalid QR");
    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Scan QR to Pay</h2>

      <div style={{ maxWidth: "400px" }}>

        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result) => handleScan(result)}
          style={{ width: "100%" }}
        />

      </div>

    </div>

  );
}