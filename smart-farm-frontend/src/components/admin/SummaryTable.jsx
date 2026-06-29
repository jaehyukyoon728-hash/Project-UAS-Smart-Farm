import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";
import { usersApi } from "../../services/api";

const cardStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
  width: "100%",
  overflow: "hidden",
};

export default function SummaryTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersApi.getAll()
      .then((res) => setUsers(res.data.data || []))
      .catch(console.error);
  }, []);

  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  // Tentukan "status irigasi" berdasarkan data prediction terbaru dari lahan
  const getIrigasiStatus = (user) => {
    const predictions = user.lands?.flatMap(l => l.crops?.flatMap(c => c.sensors?.flatMap(s => s.prediction ? [s.prediction] : []) || []) || []) || [];
    if (!predictions.length) return "Tidak Perlu Irigasi";
    const last = predictions[predictions.length - 1];
    const kondisi = last.status_kondisi || "";
    if (kondisi.toLowerCase().includes("irigasi")) return "Perlu Irigasi";
    if (kondisi.toLowerCase().includes("khusus")) return "Kondisi Khusus";
    return "Tidak Perlu Irigasi";
  };

  return (
    <div style={cardStyle}>
      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px 20px 32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1a2e1b", letterSpacing: "-0.2px" }}>
          Ringkasan Petani
        </h3>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
              {["Petani", "Email", "Lokasi", "Status"].map((h, i) => (
                <th key={h} style={{
                  textAlign: "left", padding: "16px 24px", fontSize: "11px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.07em", color: "#6b7280",
                  paddingLeft: i === 0 ? "32px" : "24px", paddingRight: i === 3 ? "32px" : "24px",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#9ca3af" }}>Memuat data...</td></tr>
            ) : users.map((user, index) => {
              const status = getIrigasiStatus(user);
              return (
                <tr key={user.id}
                  style={{ borderBottom: index < users.length - 1 ? "1px solid #f3f4f6" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "18px 24px 18px 32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e8f5e9", color: "#2d6a35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", flexShrink: 0 }}>
                        {getInitial(user.nama)}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{user.nama}</span>
                    </div>
                  </td>
                  <td style={{ padding: "18px 24px", fontSize: "14px", color: "#6b7280" }}>{user.email}</td>
                  <td style={{ padding: "18px 24px", fontSize: "14px", color: "#6b7280" }}>{user.lokasi || "-"}</td>
                  <td style={{ padding: "18px 32px 18px 24px" }}>
                    {status === "Perlu Irigasi" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#b94a4a", backgroundColor: "#fdf0f0", border: "1px solid #f5c6c6", borderRadius: "99px", whiteSpace: "nowrap" }}>
                        <FiAlertTriangle size={12} strokeWidth={2.5} /> Perlu Irigasi
                      </span>
                    ) : status === "Kondisi Khusus" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#b45309", backgroundColor: "#fef3c7", border: "1px solid #fde68a", borderRadius: "99px", whiteSpace: "nowrap" }}>
                        <FiAlertTriangle size={12} strokeWidth={2.5} /> Kondisi Khusus
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", fontSize: "12px", fontWeight: "700", color: "#15803d", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "99px", whiteSpace: "nowrap" }}>
                        <FiCheck size={12} strokeWidth={2.5} /> Tidak Perlu Irigasi
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
