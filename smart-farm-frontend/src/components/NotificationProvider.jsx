import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null); // { type: 'sukses' | 'gagal', message: '' }
  const [dialog, setDialog] = useState(null); // { message: '', onConfirm: () => {}, onCancel: () => {} }

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const confirmAction = (message, onConfirm) => {
    setDialog({
      message,
      onConfirm: () => {
        setDialog(null);
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setDialog(null);
      }
    });
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirmAction }}>
      {children}
      
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "sukses" ? "✅" : "❌"}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}

      {/* Dialog Confirmation */}
      {dialog && (
        <div className="dialog-overlay" onClick={dialog.onCancel}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <p className="dialog-message">{dialog.message}</p>
            <div className="dialog-actions">
              <button className="dialog-btn btn-cancel" onClick={dialog.onCancel}>
                Batal
              </button>
              <button className="dialog-btn btn-confirm" onClick={dialog.onConfirm}>
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
