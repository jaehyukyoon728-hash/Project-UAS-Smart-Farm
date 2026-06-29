import { useState } from "react";
import { useNotification } from "../components/NotificationProvider";
import { authApi } from "../services/api";

// ─── ICONS (inline SVG) ───────────────────────────────────────────────
const DropletIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 20, height: 20 }}
  >
    <path d="M12 2C6 8 4 12.5 4 15a8 8 0 0016 0c0-2.5-2-7-8-13z" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18 }}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18 }}
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const LeafIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 004.72 21C8.85 18.29 17 12 21 4c-3.5 2.5-7 3-10 1z" />
  </svg>
);

const ChartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ActivityIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ─── PLUS PATTERN (decorative background) ────────────────────────────
const PlusPattern = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.14,
      pointerEvents: "none",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="plus"
        x="0"
        y="0"
        width="36"
        height="36"
        patternUnits="userSpaceOnUse"
      >
        <line x1="18" y1="10" x2="18" y2="26" stroke="white" strokeWidth="1.5" />
        <line x1="10" y1="18" x2="26" y2="18" stroke="white" strokeWidth="1.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#plus)" />
  </svg>
);

// ─── STAT CARD ────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label }) => (
  <div className="metric-card">
    <span className="metric-icon-wrapper">{icon}</span>
    <span className="metric-value">{value}</span>
    <span className="metric-label">{label}</span>
  </div>
);

// ─── DEMO ACCOUNT ROW ─────────────────────────────────────────────────
const DemoRow = ({ role, name, email, onFill }) => (
  <button
    onClick={() => onFill(email)}
    title="Gunakan akun ini"
    type="button"
    className="demo-button"
  >
    <span className={`demo-badge ${role === "admin" ? "badge-admin" : "badge-farmer"}`}>
      {role === "admin" ? "Admin" : "Farm"}
    </span>
    <span className="demo-name">{name}</span>
    <span className="demo-email">{email}</span>
  </button>
);

// ─── MAIN LOGIN SCREEN ────────────────────────────────────────────────
export default function LoginScreen({ onLogin }) {
  const { showToast } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("123abc");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authApi.login({ email: email.trim(), password });
      const { token, user, role } = res.data;

      // Simpan token dan data user ke localStorage
      localStorage.setItem("smart_farm_token", token);
      localStorage.setItem("smart_farm_user", JSON.stringify({ ...user, role }));

      setSuccess(`Login sukses! Masuk sebagai ${role}.`);
      showToast("sukses", "Selamat datang! Anda berhasil masuk.");

      if (onLogin) {
        onLogin({ ...user, role });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Email atau password tidak valid.";
      setError(msg);
      showToast("gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <section className="left-pane">
        <PlusPattern />

        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <DropletIcon />
          </div>
          <span>SmartFarm</span>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Kelola Lahan,<br />Hemat Air,<br />Tingkatkan Panen
          </h1>
          <p className="hero-description">
            Sistem irigasi cerdas berbasis data sensor untuk membantu petani
            memantau kondisi lahan dan mengoptimalkan penggunaan air.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="metrics-grid">
          <StatCard icon={<LeafIcon />} value="40%" label="Hemat Air" />
          <StatCard icon={<ChartIcon />} value="500+" label="Lahan Aktif" />
          <StatCard icon={<ActivityIcon />} value="98%" label="Akurasi" />
        </div>
      </section>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <section className="right-pane">
        <div className="form-wrapper">
          {/* Header */}
          <div className="form-header">
            <h2 className="form-title">Selamat Datang</h2>
            <p className="form-subtitle">
              Masuk untuk mengakses sistem irigasi Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email
              </label>
              <div className="input-container">
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="email@contoh.com"
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password
              </label>
              <div className="input-container">
                <input
                  id="password-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="password-toggle"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="alert alert-success">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="alert alert-error">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="demo-box">
            <p className="demo-title-text">Akun Demo (DB)</p>
            <div className="demo-list">
              <DemoRow
                role="admin"
                name="Admin"
                email="admin@gmail.com"
                onFill={fillDemo}
              />
              <div className="demo-divider" />
              <DemoRow
                role="farmer"
                name="Petani (Meisya)"
                email="meisya@gmail.com"
                onFill={fillDemo}
              />
            </div>
            <p className="demo-desc-footer">
              Password default:{" "}
              <code className="demo-code-inline">123abc</code>
            </p>
          </div>
        </div>

        {/* Faint Paddy Field Background */}
        <div className="paddy-bg"></div>
      </section>
    </div>
  );
}
