import React, { useEffect, useState } from "react";
import { FiUserPlus, FiDatabase, FiAlertTriangle, FiDroplet, FiFileText } from "react-icons/fi";
import { activitiesApi } from "../../services/api";

const iconMap = {
  "user": FiUserPlus,
  "sensor": FiDatabase,
  "lahan": FiAlertTriangle,
  "prediksi": FiDroplet,
  "aktivitas": FiFileText,
};

const colorMap = [
  { color: "#2d6a35", bg: "#e8f5e9" },
  { color: "#2563eb", bg: "#eff6ff" },
  { color: "#ea580c", bg: "#fff7ed" },
  { color: "#7c3aed", bg: "#f5f3ff" },
  { color: "#2d6a35", bg: "#e8f5e9" },
];

const cardStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
  width: "100%",
  overflow: "hidden",
};

function timeAgo(dateStr) {
  if (!dateStr) return "-";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    activitiesApi.getAll()
      .then((res) => {
        const data = res.data.data || [];
        // Ambil 5 terbaru
        setActivities(data.slice(-5).reverse());
      })
      .catch(console.error);
  }, []);

  return (
    <div style={cardStyle}>
      <div style={{ padding: "24px 32px 20px 32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1a2e1b", letterSpacing: "-0.2px" }}>
          Aktivitas Terbaru
        </h3>
      </div>

      <div style={{ padding: "0 32px 24px" }}>
        {activities.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>Belum ada aktivitas.</p>
        ) : activities.map((act, i) => {
          const key = Object.keys(iconMap).find(k => (act.activity_type || "").toLowerCase().includes(k));
          const Icon = iconMap[key] || FiFileText;
          const palette = colorMap[i % colorMap.length];
          return (
            <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: i < activities.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: palette.bg, color: palette.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#111827" }}>{act.activity_type}</p>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6b7280" }}>{act.description}</p>
              </div>
              <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap", marginTop: "2px" }}>
                {timeAgo(act.created_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
