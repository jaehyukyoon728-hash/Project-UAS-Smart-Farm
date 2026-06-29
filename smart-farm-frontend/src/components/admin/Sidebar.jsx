import React, { useState } from "react";
import { MdDashboard, MdPeopleOutline, MdOutlineLocationOn, MdOutlineStorage } from "react-icons/md";
import { IoLeafSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import ConfirmDialog from "../ConfirmDialog";

const navItems = [
  { label: "Dashboard", icon: MdDashboard },
  { label: "Kelola Pengguna", icon: MdPeopleOutline },
  { label: "Monitoring Lahan", icon: MdOutlineLocationOn },
  { label: "Monitoring Sensor", icon: MdOutlineStorage },
];

// Plus pattern background — same as FarmerDashboard
const PlusPattern = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.1,
      pointerEvents: "none",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="adminplus"
        x="0"
        y="0"
        width="32"
        height="32"
        patternUnits="userSpaceOnUse"
      >
        <line x1="16" y1="8" x2="16" y2="24" stroke="white" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="1.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#adminplus)" />
  </svg>
);

export default function Sidebar({ user, onLogout, activeItem: externalActiveItem, onNavigate }) {
  const [internalActiveItem, setInternalActiveItem] = useState("Dashboard");
  const activeItem = externalActiveItem || internalActiveItem;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSelect = (label) => {
    if (onNavigate) {
      onNavigate(label);
    }
    setInternalActiveItem(label);
  };

  return (
    <>
    <aside className="admin-sidebar">
      <PlusPattern />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "20px",
          fontWeight: "700",
          letterSpacing: "-0.5px",
          zIndex: 10,
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.25)",
            flexShrink: 0,
          }}
        >
          <IoLeafSharp size={22} />
        </div>
        <div>
          <span style={{ display: "block", lineHeight: 1.2 }}>SmartFarm</span>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.6)",
              marginTop: "3px",
            }}
          >
            Administrator
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", zIndex: 10 }}>
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleSelect(item.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                border: isActive
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid transparent",
                borderRadius: "10px",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.72)",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.72)";
                }
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer — user profile + logout */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          zIndex: 10,
        }}
      >
        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Ahmad Wijaya
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.6)",
                fontWeight: "500",
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || "admin@irigasi.id"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            width: "100%",
            padding: "10px 16px",
            backgroundColor: "rgba(239,68,68,0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.22)",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)";
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.22)";
          }}
        >
          <FiLogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

      {/* Konfirmasi Logout Admin */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        type="logout"
        title="Keluar dari Panel Admin?"
        message="Apakah Anda yakin ingin keluar dari SmartFarm Admin? Anda perlu login kembali untuk mengakses panel ini."
        confirmText="Ya, Keluar"
        cancelText="Tidak"
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
