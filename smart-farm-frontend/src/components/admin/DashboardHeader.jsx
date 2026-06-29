import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";

export default function DashboardHeader({
  title = "Dashboard Admin",
  subtitle = "Ringkasan seluruh sistem irigasi pintar",
  showSearch = true,
  compactTitle = false,
}) {
  // Get today's date in Indonesian format
  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* ── Topbar ── */}
      <div className="admin-header-topbar">
        {showSearch ? (
          <div className="admin-header-search">
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7a8c7b",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <FiSearch size={17} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Cari data admin..."
              style={{
                width: "100%",
                padding: "11px 16px 11px 42px",
                border: "1.5px solid #d4ddd5",
                borderRadius: "24px",
                fontFamily: "inherit",
                fontSize: "14px",
                color: "#1a2e1b",
                backgroundColor: "#ffffff",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2d6a35";
                e.target.style.boxShadow = "0 0 0 4px rgba(45,106,53,0.12), 0 2px 4px rgba(0,0,0,0.03)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d4ddd5";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)";
              }}
            />
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* Actions */}
        <div className="admin-header-actions">
          <div
            style={{
              background: "rgba(45,106,53,0.08)",
              border: "1.5px solid rgba(45,106,53,0.2)",
              color: "#2d6a35",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            {dateStr}
          </div>
        </div>
      </div>

      {/* ── Welcome Section ── */}
      <div
        style={{
          marginBottom: compactTitle ? "14px" : "24px",
          marginTop: compactTitle ? "-2px" : "4px",
          position: "relative",
          transform: compactTitle ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#1a2e1b",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7d6c",
            marginTop: "4px",
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </p>
      </div>
    </>
  );
}
