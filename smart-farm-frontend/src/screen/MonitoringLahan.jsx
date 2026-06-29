import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiMapPin,
} from "react-icons/fi";
import { MdOutlineGrass } from "react-icons/md";
import { landsApi } from "../services/api";


const cropColors = {
  Padi: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Jagung: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Kedelai: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  Cabai: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};

const statusConfig = {
  Normal: {
    label: "Normal",
    className: "normal",
    icon: FiCheckCircle,
    dot: "#16a34a",
  },
  "Perlu Penyiraman": {
    label: "Perlu Penyiraman",
    className: "critical",
    icon: FiAlertTriangle,
    dot: "#dc2626",
  },
  "Tidak Perlu Penyiraman": {
    label: "Tidak Perlu Penyiraman",
    className: "info",
    icon: FiInfo,
    dot: "#2563eb",
  },
};

export default function MonitoringLahan() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    landsApi.getAll()
      .then((res) => setLands(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Normalise field names dari backend ke tampilan
  const normalised = lands.map((l) => ({
    id: l.id,
    name: l.nama_lahan || l.nama || l.name || "-",
    owner: l.user?.nama || l.owner || "-",
    location: l.lokasi || l.location || "-",
    area: l.luas_lahan ? `${l.luas_lahan} ha` : (l.area || "-"),
    crop: l.crops?.[0]?.nama || l.crop || "-",
    status: l.status || "Normal",
  }));

  const filteredLands = useMemo(() => {
    const query = search.toLowerCase();
    return normalised.filter((land) =>
      land.name.toLowerCase().includes(query) ||
      land.location.toLowerCase().includes(query) ||
      land.owner.toLowerCase().includes(query)
    );
  }, [search, normalised]);

  // Summary counts
  const totalLahan = normalised.length;
  const normalCount = normalised.filter((l) => l.status === "Normal").length;
  const kritisCount = normalised.filter((l) => l.status === "Perlu Penyiraman").length;
  const tidakPerluCount = normalised.filter((l) => l.status === "Tidak Perlu Penyiraman").length;

  const summaryCards = [
    {
      label: "Total Lahan",
      value: totalLahan,
      color: "#2d6a35",
      bg: "linear-gradient(135deg, #2d6a35 0%, #3e7e44 100%)",
      textColor: "#fff",
      subColor: "rgba(255,255,255,0.75)",
    },
    {
      label: "Status Normal",
      value: normalCount,
      color: "#16a34a",
      bg: "#f0fdf4",
      textColor: "#15803d",
      subColor: "#4ade80",
      border: "#bbf7d0",
    },
    {
      label: "Perlu Penyiraman",
      value: kritisCount,
      color: "#dc2626",
      bg: "#fdf2f2",
      textColor: "#dc2626",
      subColor: "#f87171",
      border: "#fca5a5",
    },
    {
      label: "Tidak Perlu Siram",
      value: tidakPerluCount,
      color: "#2563eb",
      bg: "#eff6ff",
      textColor: "#1d4ed8",
      subColor: "#93c5fd",
      border: "#bfdbfe",
    },
  ];

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const renderStatus = (status) => {
    const cfg = statusConfig[status];
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
          letterSpacing: "0.01em",
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
        {summaryCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: card.bg,
              border: card.border ? `1.5px solid ${card.border}` : "none",
              borderRadius: "16px",
              padding: "18px 20px",
              boxShadow: i === 0
                ? "0 8px 24px rgba(45,106,53,0.18)"
                : "0 2px 8px rgba(15,23,42,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = i === 0
                ? "0 12px 30px rgba(45,106,53,0.25)"
                : "0 6px 20px rgba(15,23,42,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = i === 0
                ? "0 8px 24px rgba(45,106,53,0.18)"
                : "0 2px 8px rgba(15,23,42,0.04)";
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: "600", color: card.subColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {card.label}
            </p>
            <p style={{ fontSize: "32px", fontWeight: "800", color: card.textColor, lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: "12px", color: card.subColor, fontWeight: "500" }}>lahan</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 18px",
            background: "#ffffff",
            border: "1.5px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            color: "#9ca3af",
            flex: "1",
            minWidth: "280px",
            transition: "all 0.2s",
          }}
          onFocusWithin={(e) => {
            e.currentTarget.style.borderColor = "#2d6a35";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,106,53,0.12)";
          }}
        >
          <FiSearch size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Cari nama, pemilik, atau lokasi lahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
              fontSize: "14px",
              color: "#1a2e1b",
            }}
            onFocus={(e) => {
              e.currentTarget.parentElement.style.borderColor = "#2d6a35";
              e.currentTarget.parentElement.style.boxShadow = "0 0 0 3px rgba(45,106,53,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.parentElement.style.borderColor = "#e5e7eb";
              e.currentTarget.parentElement.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", padding: "0", display: "flex" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Result count */}
        {search && (
          <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600" }}>
            {filteredLands.length} dari {totalLahan} lahan
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
                {["Nama Lahan", "Pemilik", "Lokasi", "Luas"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 24px",
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
              {filteredLands.length > 0 ? (
                filteredLands.map((land) => {
                  const isHovered = hoveredRow === land.id;
                  return (
                    <tr
                      key={land.id}
                      onMouseEnter={() => setHoveredRow(land.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: "1px solid #f9fafb",
                        background: isHovered ? "#f9fcf9" : "transparent",
                        transition: "background 0.15s ease",
                      }}
                    >
                      {/* Nama Lahan */}
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>
                          {land.name}
                        </span>
                      </td>

                      {/* Pemilik */}
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #2d6a35 0%, #4f7f48 100%)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700",
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {getInitial(land.owner)}
                          </div>
                          <span style={{ fontSize: "14px", color: "#374151" }}>{land.owner}</span>
                        </div>
                      </td>

                      {/* Lokasi */}
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "13px" }}>
                          <FiMapPin size={13} />
                          {land.location}
                        </div>
                      </td>

                      {/* Luas */}
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontWeight: "700", color: "#374151", fontSize: "14px" }}>{land.area}</span>
                      </td>


                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "52px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: "#9ca3af" }}>
                      <MdOutlineGrass size={40} />
                      <p style={{ fontSize: "15px", fontWeight: "600" }}>Tidak ada lahan yang cocok</p>
                      <p style={{ fontSize: "13px" }}>Coba ubah kata kunci atau filter tanaman</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filteredLands.length > 0 && (
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
              Menampilkan <strong style={{ color: "#374151" }}>{filteredLands.length}</strong> dari{" "}
              <strong style={{ color: "#374151" }}>{totalLahan}</strong> lahan
            </span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>SmartFarm Monitoring</span>
          </div>
        )}
      </div>
    </div>
  );
}
