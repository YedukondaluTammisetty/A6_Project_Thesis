import { useNavigate } from "react-router-dom";
import logo from "../assets/transactpro.png";

export default function Home() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-area">
          <img src={logo} alt="TransactPro Logo"/>
        </div>

        <div className="nav-buttons">
          <button
            className="btn-outline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <h1>
          Smart Banking for the <br />
          <span>Digital India</span>
        </h1>

        <p>
          Secure payments, instant transfers, wallet management,
          and real-time transaction tracking — all in one app.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

          <button
            className="btn-outline"
            onClick={scrollToFeatures}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features">

        <div className="feature">
          <div className="emoji-phone">💳</div>
          <div className="feature-text">
            <h2>Wallet & Balance Management</h2>
            <p>
              Instantly check wallet balance, add money securely,
              and manage funds effortlessly.
            </p>
          </div>
        </div>

        <div className="feature reverse">
          <div className="emoji-phone">📲</div>
          <div className="feature-text">
            <h2>Instant Money Transfer</h2>
            <p>
              Send money instantly using mobile numbers with
              real-time confirmation.
            </p>
          </div>
        </div>

        <div className="feature">
          <div className="emoji-phone">📊</div>
          <div className="feature-text">
            <h2>Transaction History</h2>
            <p>
              View credits, debits, timestamps, and mini statements
              with full transparency.
            </p>
          </div>
        </div>

        <div className="feature reverse">
          <div className="emoji-phone">🔐</div>
          <div className="feature-text">
            <h2>Bank-Grade Security</h2>
            <p>
              JWT authentication, encrypted passwords, and secure
              Razorpay payments keep your money safe.
            </p>
          </div>
        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <h2>Start Your Digital Banking Journey</h2>
        <button
          className="cta-btn"
          onClick={() => navigate("/signup")}
        >
          Create Free Account
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <img src={logo} alt="TransactPro Logo" />
        <p>Next-Generation Digital Payment Platform</p>
        <p>Made with ❤️ by Santosh</p>
      </footer>

    </div>
  );
}
