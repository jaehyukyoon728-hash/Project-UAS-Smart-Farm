import React, { useEffect } from "react";

/**
 * ConfirmDialog — Reusable premium confirmation popup
 *
 * Props:
 *  - isOpen      : boolean  — tampilkan / sembunyikan dialog
 *  - title       : string   — judul dialog  (default: "Konfirmasi Tindakan")
 *  - message     : string   — pesan deskripsi
 *  - onConfirm   : function — dipanggil saat klik "Ya"
 *  - onCancel    : function — dipanggil saat klik "Tidak" atau overlay
 *  - type        : "danger" | "warning" | "info"  (default: "danger")
 *  - confirmText : string   — teks tombol konfirmasi  (default: "Ya, Lanjutkan")
 *  - cancelText  : string   — teks tombol batal       (default: "Tidak")
 */
export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melakukan tindakan ini?",
  onConfirm,
  onCancel,
  type = "danger",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Tidak",
}) {
  /* Tutup dengan Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onCancel?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  /* Warna berdasarkan type */
  const palette = {
    danger:  { accent: "#ef4444", light: "#fef2f2", border: "#fecaca", icon: "🗑️", iconBg: "#fee2e2" },
    warning: { accent: "#f59e0b", light: "#fffbeb", border: "#fde68a", icon: "⚠️", iconBg: "#fef3c7" },
    info:    { accent: "#3b82f6", light: "#eff6ff", border: "#bfdbfe", icon: "ℹ️", iconBg: "#dbeafe" },
    logout:  { accent: "#6366f1", light: "#eef2ff", border: "#c7d2fe", icon: "🚪", iconBg: "#e0e7ff" },
  };
  const p = palette[type] || palette.danger;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        /* Backdrop blur premium */
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        animation: "cdFadeIn 0.2s ease",
      }}
      onClick={onCancel}
    >
      {/* Dialog Box */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(15,23,42,0.25), 0 8px 20px rgba(15,23,42,0.12)",
          padding: "32px",
          maxWidth: "420px",
          width: "100%",
          animation: "cdSlideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${p.accent}, ${p.accent}cc)`,
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* Icon + Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
          {/* Icon bubble */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: p.iconBg,
              border: `2px solid ${p.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: `0 4px 14px ${p.accent}22`,
              flexShrink: 0,
            }}
          >
            {p.icon}
          </div>

          {/* Title */}
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: "#111827",
                margin: "0 0 8px 0",
                letterSpacing: "-0.3px",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: 0,
                lineHeight: 1.6,
                fontWeight: "500",
              }}
            >
              {message}
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: "1px", background: "#f3f4f6" }} />

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            {/* Tidak / Cancel */}
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                background: "#ffffff",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.18s ease",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {cancelText}
            </button>

            {/* Ya / Confirm */}
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${p.accent}, ${p.accent}dd)`,
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.18s ease",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
                boxShadow: `0 4px 14px ${p.accent}44`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 20px ${p.accent}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 14px ${p.accent}44`;
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes cdFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cdSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
