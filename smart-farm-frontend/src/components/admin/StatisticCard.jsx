import React, { useState } from "react";

export default function StatisticCard({
  icon,
  iconBg,
  titleColor,
  title,
  value,
  description,
  accentColor,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="admin-statistic-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: hovered
          ? `1px solid ${accentColor || "#2d6a35"}40`
          : "1px solid rgba(4,120,87,0.08)",
        padding: "26px 28px",
        minHeight: "148px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: hovered
          ? "0 10px 20px -5px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: accentColor || "#2d6a35",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#ffffff",
          background: iconBg,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: titleColor || "#6b7280",
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
        <h3
          style={{
            fontSize: "36px",
            fontWeight: "800",
            color: "#111827",
            lineHeight: 1.1,
            marginTop: "8px",
            marginBottom: "6px",
          }}
        >
          {value}
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.3 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// Keep export for backward compat
export const cardClass =
  "bg-white rounded-[20px] border border-[#E8EAED] shadow-[0_2px_16px_rgba(0,0,0,0.07)]";
