import React, { useState, useEffect } from "react";
import LandManagement from "./LandManagement";
import ConfirmDialog from "../components/ConfirmDialog";
import { landsApi, predictionsApi } from "../services/api";

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

const PredictionIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16 }}
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

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

export default function FarmerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [lands, setLands] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      landsApi.getAll(),
      predictionsApi.getAll(),
    ]).then(([landsRes, predRes]) => {
      const allLands = landsRes.data.data || [];
      const myLands = allLands.filter(l => l.user_id === user.id);
      setLands(myLands);

      const myLandIds = myLands.map(l => l.id);
      const allPredictions = predRes.data.data || [];
      const myPredictions = allPredictions.filter(p => p.sensor && myLandIds.includes(p.sensor.land_id));
      setPredictions(myPredictions);
    }).catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab, user.id]);

  const totalCrops = lands.reduce((sum, l) => sum + (l.crops?.length || 0), 0);

  // Cari prediksi terbaru untuk setiap tanaman
  const latestPredictions = [];
  lands.forEach(land => {
    (land.crops || []).forEach(crop => {
      const cropPreds = predictions.filter(p => p.sensor?.crop_id === crop.id);
      if (cropPreds.length > 0) {
        const latest = cropPreds.reduce((latest, current) => {
          return new Date(current.created_at || current.tanggal_pencatatan) > new Date(latest.created_at || latest.tanggal_pencatatan) ? current : latest;
        }, cropPreds[0]);
        latestPredictions.push(latest);
      }
    });
  });

  const perluIrigasiCount = latestPredictions.filter(p => {
    const cond = (p.status_kondisi || "").toLowerCase();
    return cond.includes("perlu irigasi") || cond === "irigasi";
  }).length;

  const penangananKhususCount = latestPredictions.filter(p => {
    const cond = (p.status_kondisi || "").toLowerCase();
    return cond.includes("khusus") || cond.includes("monitoring");
  }).length;

  const latestLandsData = lands.slice(0, 3).map(land => {
    const landSensors = (land.crops || []).flatMap(c => c.sensors || []);
    let latestMoi = "-";
    if (landSensors.length > 0) {
      const latestSensor = landSensors.reduce((latest, current) => {
        return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
      }, landSensors[0]);
      latestMoi = latestSensor.moi ? `${latestSensor.moi}%` : "-";
    }

    const landPreds = predictions.filter(p => p.sensor && p.sensor.land_id === land.id);
    let statusKondisi = "Kondisi Normal";
    let isAlert = false;
    let className = "text-success";
    if (landPreds.length > 0) {
      const latestPred = landPreds.reduce((latest, current) => {
        return new Date(current.created_at || current.tanggal_pencatatan) > new Date(latest.created_at || latest.tanggal_pencatatan) ? current : latest;
      }, landPreds[0]);
      const status = latestPred.status_kondisi || "";
      statusKondisi = status;
      if (status.toLowerCase().includes("perlu irigasi") || status.toLowerCase() === "irigasi") {
        statusKondisi = "Perlu Irigasi Segera";
        isAlert = true;
        className = "text-danger";
      } else if (status.toLowerCase().includes("khusus") || status.toLowerCase().includes("monitoring")) {
        statusKondisi = "Butuh Penanganan Khusus";
        isAlert = true;
        className = "text-warning";
      }
    }

    return {
      name: land.nama || land.nama_lahan || "-",
      moisture: latestMoi,
      status: statusKondisi,
      class: isAlert ? (className === "text-danger" ? "Class 1" : "Class 2") : "Class 0",
      alert: isAlert,
    };
  });

  const predictionHistoryData = predictions.slice(0, 5).map(p => {
    const cropName = p.sensor?.crop?.nama || "-";
    const soilType = p.sensor?.crop?.jenis_tanah || "-";
    const result = p.status_kondisi || "-";
    
    let displayResult = "Tidak Irigasi";
    if (result.toLowerCase().includes("perlu irigasi") || result.toLowerCase() === "irigasi") {
      displayResult = "Irigasi";
    } else if (result.toLowerCase().includes("khusus") || result.toLowerCase().includes("monitoring")) {
      displayResult = "Kondisi Khusus";
    }

    return {
      crop: cropName,
      soil: soilType,
      result: displayResult,
    };
  });

  return (
    <div className="dashboard-layout">
      {/* ── SIDEBAR ────────────────────────────────────────── */}
      <aside className="dashboard-sidebar">
        <PlusPattern />

        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <DropletIcon />
          </div>
          <span>SmartFarm</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "nav-item-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("dashboard")}
          >
            <ChartIcon />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === "land" ? "nav-item-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("land")}
          >
            <LeafIcon />
            <span>Lahan Saya</span>
          </button>
        </nav>

        {/* Profile / Footer */}
        <div className="sidebar-footer">
          <div className="user-profile-box">
            <div className="avatar-circle">
              👨‍🌾
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || "Petani"}</span>
              <span className="profile-role">Akun Petani</span>
            </div>
          </div>

          <button onClick={() => setShowLogoutConfirm(true)} className="logout-btn" type="button">
            <LogoutIcon />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      {activeTab === "dashboard" ? (
        <main className="dashboard-main">
          {/* Topbar */}
          <div className="dashboard-topbar">
            <div className="search-wrapper">
              <span className="search-icon-inside">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Cari lahan pertanian..."
                className="dashboard-search-input"
              />
            </div>

            <div className="topbar-actions">
              <div className="date-badge">
                25 Juni 2026
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="welcome-section">
            <h2 className="welcome-title">
              Selamat Datang Kembali, {user?.name || "Petani"}!
            </h2>
            <p className="welcome-subtitle">
              Ringkasan dan tinjauan kondisi irigasi lahan pertanian Anda saat ini.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="dashboard-stats-grid">
            <div className="dashboard-card">
              <p className="card-label">Total Lahan</p>
              <h3 className="card-value">{loading ? "..." : lands.length}</h3>
            </div>

            <div className="dashboard-card">
              <p className="card-label">Total Tanaman</p>
              <h3 className="card-value">{loading ? "..." : totalCrops}</h3>
            </div>

            <div className="dashboard-card card-alert-danger">
              <p className="card-label">Perlu Irigasi</p>
              <h3 className="card-value">{loading ? "..." : perluIrigasiCount}</h3>
            </div>

            <div className="dashboard-card card-alert-warning">
              <p className="card-label">Penanganan Khusus</p>
              <h3 className="card-value">{loading ? "..." : penangananKhususCount}</h3>
            </div>
          </div>

          {/* Content Layout Grid */}
          <div className="dashboard-content-grid">
            {/* Status Lahan */}
            <div>
              <div className="table-card">
                <div className="content-column-title-row">
                  <h3 className="content-column-title">Status Lahan Terbaru</h3>
                  <button className="view-all-link" type="button" onClick={() => setActiveTab("land")}>
                    Lihat Semua
                  </button>
                </div>

                <div className="status-list">
                  {loading ? (
                    <div style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>Memuat...</div>
                  ) : latestLandsData.length > 0 ? (
                    latestLandsData.map((land, index) => (
                      <div
                        key={index}
                        className={`status-item ${land.alert ? "status-item-alert" : "status-item-normal"
                          }`}
                      >
                        <h4 className="status-item-title">{land.name}</h4>
                        <p className="status-item-desc">Kelembapan: {land.moisture}</p>
                        <span
                          className={`status-item-badge ${land.class === "Class 1"
                            ? "text-danger"
                            : land.class === "Class 2"
                              ? "text-warning"
                              : "text-success"
                            }`}
                        >
                          {land.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>Belum ada lahan.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabel Riwayat Prediksi */}
            <div>
              <div className="table-card">
                <div className="table-header-row">
                  <h3 className="content-column-title">Riwayat Prediksi Irigasi</h3>
                  <button className="refresh-btn" type="button" onClick={fetchDashboardData}>
                    Segarkan
                  </button>
                </div>

                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Tanaman</th>
                      <th>Jenis Tanah</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>Memuat...</td></tr>
                    ) : predictionHistoryData.length > 0 ? (
                      predictionHistoryData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.crop}</td>
                          <td>{item.soil}</td>
                          <td>
                            <span
                              className={`result-badge ${item.result === "Tidak Irigasi"
                                ? "badge-class0"
                                : item.result === "Irigasi"
                                  ? "badge-class1"
                                  : "badge-class2"
                                }`}
                            >
                              {item.result}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>Belum ada riwayat prediksi.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <LandManagement />
      )}

      {/* Konfirmasi Logout */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        type="logout"
        title="Keluar dari Aplikasi?"
        message="Apakah Anda yakin ingin keluar dari SmartFarm? Anda perlu login kembali untuk mengaksesnya."
        confirmText="Ya, Keluar"
        cancelText="Tidak"
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}