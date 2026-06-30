import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiFilter,
  FiThermometer,
  FiDroplet,
  FiCalendar,
  FiCloud,
} from "react-icons/fi";
import { MdOutlineStorage } from "react-icons/md";
import { sensorsApi } from "../services/api";


const cropColors = {
  Padi: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Jagung: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Kedelai: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  Cabai: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};

const statusConfig = {
  Normal: { label: "Tidak Irigasi", className: "normal", icon: FiCheckCircle },
  "Perlu Penyiraman": { label: "Irigasi", className: "critical", icon: FiAlertTriangle },
  "Tidak Perlu Penyiraman": { label: "Kondisi Khusus", className: "info", icon: FiInfo },
};

// Mini humidity bar
function HumidityBar({ value }) {
  const pct = Math.min(100, Math.max(0, value));
  let barColor = "#2563eb";
  if (pct < 40) barColor = "#dc2626";
  else if (pct > 75) barColor = "#16a34a";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FiDroplet size={14} color={barColor} />
      <div style={{ flex: 1, minWidth: "60px" }}>
        <div
          style={{
            height: "5px",
            background: "#f3f4f6",
            borderRadius: "99px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: barColor,
              borderRadius: "99px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>
      <span style={{ fontSize: "13px", fontWeight: "700", color: barColor, minWidth: "38px" }}>
        {value}%
      </span>
    </div>
  );
}

// Temperature chip
function TempChip({ value }) {
  let color = "#f59e0b";
  let bg = "#fffbeb";
  if (value >= 30) { color = "#dc2626"; bg = "#fdf2f2"; }
  else if (value < 25) { color = "#2563eb"; bg = "#eff6ff"; }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <FiThermometer size={13} color={color} />
      <span style={{ fontSize: "13px", fontWeight: "700", color, background: bg, padding: "2px 8px", borderRadius: "6px" }}>
        {value}°C
      </span>
    </div>
  );
}

export default function MonitoringSensor() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Semua Tanaman");
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    sensorsApi.getAll()
      .then((res) => setSensors(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getNormalizedStatus = (statusKondisi) => {
    if (!statusKondisi) return "Normal";
    const s = statusKondisi.toLowerCase();
    if (s.includes("irigasi") && !s.includes("tidak")) {
      return "Perlu Penyiraman";
    }
    if (s.includes("khusus") || s.includes("monitoring")) {
      return "Tidak Perlu Penyiraman";
    }
    return "Normal";
  };

  // Normalise field names dari backend ke tampilan
  const normSensors = sensors.map((s) => ({
    id: s.id,
    landName: s.crop?.land?.nama_lahan || s.crop?.land?.nama || "-",
    owner: s.crop?.land?.user?.nama || "-",
    crop: s.crop?.nama || "-",
    humidity: Number(s.moi ?? 0),
    temperature: Number(s.tempt ?? 0),
    rainfall: Number(s.kelembaban_udara ?? 0),
    date: (s.created_at || "").split("T")[0],
    recommendation: getNormalizedStatus(s.prediction?.status_kondisi),
  }));

  const filteredSensors = useMemo(() => {
    return normSensors.filter((sensor) => {
      const matchDate = !selectedDate || sensor.date === selectedDate;
      const matchCrop = selectedCrop === "Semua Tanaman" || sensor.crop === selectedCrop;
      return matchDate && matchCrop;
    });
  }, [selectedDate, selectedCrop, normSensors]);

  // Summary aggregates
  const avgHumidity = normSensors.length
    ? Math.round(normSensors.reduce((s, r) => s + r.humidity, 0) / normSensors.length)
    : 0;
  const avgTemp = normSensors.length
    ? (normSensors.reduce((s, r) => s + r.temperature, 0) / normSensors.length).toFixed(1)
    : 0;
  const avgAirHumidity = normSensors.length
    ? Math.round(normSensors.reduce((s, r) => s + r.rainfall, 0) / normSensors.length)
    : 0;

  // Group sensors by crop_id to find the latest sensor for each crop
  const latestSensorPerCrop = {};
  sensors.forEach(s => {
    const cropId = s.crop_id;
    const currentMilli = new Date(s.created_at || 0).getTime();
    const latestMilli = latestSensorPerCrop[cropId] ? new Date(latestSensorPerCrop[cropId].created_at || 0).getTime() : 0;
    if (!latestSensorPerCrop[cropId] || currentMilli > latestMilli) {
      latestSensorPerCrop[cropId] = s;
    }
  });

  // Determine which lands are critical based on the latest prediction of their crops
  const criticalLandIds = new Set();
  Object.values(latestSensorPerCrop).forEach(s => {
    const cond = (s.prediction?.status_kondisi || "").toLowerCase();
    const needsIrrigation = cond.includes("irigasi") && !cond.includes("tidak");
    if (needsIrrigation && s.crop && s.crop.land_id) {
      criticalLandIds.add(s.crop.land_id);
    }
  });

  const criticalCount = criticalLandIds.size;

  const summaryCards = [
    {
      label: "Kelembapan Tanah",
      value: `${avgHumidity}%`,
      icon: FiDroplet,
      bg: "#eff6ff",
      textColor: "#1d4ed8",
      subColor: "#93c5fd",
      border: "#bfdbfe",
      iconColor: "#2563eb",
    },
    {
      label: "Rata-rata Suhu",
      value: `${avgTemp}°C`,
      icon: FiThermometer,
      bg: "#fffbeb",
      textColor: "#d97706",
      subColor: "#fbbf24",
      border: "#fde68a",
      iconColor: "#f59e0b",
    },
    {
      label: "Kelembapan Udara",
      value: `${avgAirHumidity}%`,
      icon: FiCloud,
      bg: "#f0fdf4",
      textColor: "#15803d",
      subColor: "#4ade80",
      border: "#bbf7d0",
      iconColor: "#16a34a",
    },
    {
      label: "Perlu Penyiraman",
      value: criticalCount,
      icon: FiAlertTriangle,
      bg: "#fdf2f2",
      textColor: "#dc2626",
      subColor: "#f87171",
      border: "#fca5a5",
      iconColor: "#dc2626",
    },
  ];

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const renderRecommendation = (recommendation) => {
    const cfg = statusConfig[recommendation];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
      <span className={`mon-status-badge ${cfg.className}`}>
        <Icon size={13} strokeWidth={2.5} />
        {cfg.label}
      </span>
    );
  };

  const renderCropBadge = (crop) => {
    const c = cropColors[crop] || { bg: "#f0f4f1", color: "#4b6b54", border: "#dcdfdc" };
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 11px",
          borderRadius: "99px",
          fontSize: "12px",
          fontWeight: "700",
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
        }}
      >
        {crop}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "-4px" }}>

      {/* ── Summary Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
        }}
      >
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                background: card.bg,
                border: `1.5px solid ${card.border}`,
                borderRadius: "16px",
                padding: "18px 20px",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,23,42,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.04)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: card.subColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {card.label}
                </p>
                <Icon size={18} color={card.iconColor} />
              </div>
              <p style={{ fontSize: "28px", fontWeight: "800", color: card.textColor, lineHeight: 1.1 }}>
                {card.value}
              </p>
              <p style={{ fontSize: "12px", color: card.subColor, fontWeight: "500" }}>
                dari {sensors.length} pencatatan
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Filter Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Date filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiCalendar size={15} color="#6b7280" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "10px 14px",
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#2c3e2d",
              fontWeight: "600",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2d6a35";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,106,53,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
            }}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#6b7280",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "8px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Crop filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiFilter size={15} color="#6b7280" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            style={{
              padding: "10px 14px",
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#2c3e2d",
              fontWeight: "600",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2d6a35";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,106,53,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
            }}
          >
            <option value="Semua Tanaman">🌿 Semua Tanaman</option>
            <option value="Padi">🌾 Padi</option>
            <option value="Jagung">🌽 Jagung</option>
            <option value="Kedelai">🫘 Kedelai</option>
            <option value="Cabai">🌶️ Cabai</option>
          </select>
        </div>

        {/* Result count */}
        {(selectedDate || selectedCrop !== "Semua Tanaman") && (
          <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600" }}>
            {filteredSensors.length} dari {sensors.length} data
          </span>
        )}
      </div>

      {/* ── Table Card ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(15,23,42,0.05)",
          overflow: "hidden",
          border: "1px solid #f1f5f1",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafbfa" }}>
                {["Lahan", "Pemilik", "Tanaman", "Tanggal", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#9ca3af",
                      borderBottom: "1px solid #f3f4f6",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSensors.length > 0 ? (
                filteredSensors.map((sensor) => {
                  const isHovered = hoveredRow === sensor.id;
                  return (
                    <tr
                      key={sensor.id}
                      onMouseEnter={() => setHoveredRow(sensor.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: "1px solid #f9fafb",
                        background: isHovered ? "#f9fcf9" : "transparent",
                        transition: "background 0.15s ease",
                      }}
                    >
                      {/* Lahan */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>
                          {sensor.landName}
                        </span>
                      </td>

                      {/* Pemilik */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #2d6a35 0%, #4f7f48 100%)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700",
                              fontSize: "12px",
                              flexShrink: 0,
                            }}
                          >
                            {getInitial(sensor.owner)}
                          </div>
                          <span style={{ fontSize: "13px", color: "#6b7280" }}>{sensor.owner}</span>
                        </div>
                      </td>

                      {/* Tanaman */}
                      <td style={{ padding: "16px 20px" }}>
                        {renderCropBadge(sensor.crop)}
                      </td>


                      {/* Tanggal */}
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#6b7280",
                            background: "#f3f4f6",
                            padding: "3px 9px",
                            borderRadius: "7px",
                          }}
                        >
                          {sensor.date}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px 20px" }}>
                        {renderRecommendation(sensor.recommendation)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: "52px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: "#9ca3af" }}>
                      <MdOutlineStorage size={40} />
                      <p style={{ fontSize: "15px", fontWeight: "600" }}>Tidak ada data sensor yang cocok</p>
                      <p style={{ fontSize: "13px" }}>Coba ubah tanggal atau filter tanaman</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredSensors.length > 0 && (
          <div
            style={{
              padding: "12px 24px",
              borderTop: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fafbfa",
            }}
          >
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>
              Menampilkan <strong style={{ color: "#374151" }}>{filteredSensors.length}</strong> dari{" "}
              <strong style={{ color: "#374151" }}>{sensors.length}</strong> pencatatan sensor
            </span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>SmartFarm Sensor</span>
          </div>
        )}
      </div>
    </div>
  );
}
