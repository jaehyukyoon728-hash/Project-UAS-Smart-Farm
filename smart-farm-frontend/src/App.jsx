import { useState } from "react";
import LoginScreen from "./screen/LoginScreen";
import AdminDashboard from "./screen/AdminDashboard";
import FarmerDashboard from "./screen/FarmerDashboard";
import { useNotification } from "./components/NotificationProvider";
import { authApi } from "./services/api";

export default function App() {
  // Baca user dari localStorage agar session bertahan saat refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("smart_farm_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const { confirmAction, showToast } = useNotification();

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    confirmAction("Apakah Anda yakin ingin keluar dari sistem?", async () => {
      try {
        await authApi.logout();
      } catch {
        // Abaikan error logout (token mungkin sudah expired)
      }
      localStorage.removeItem("smart_farm_token");
      localStorage.removeItem("smart_farm_user");
      setUser(null);
      showToast("sukses", "Anda telah berhasil keluar.");
    });
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <FarmerDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}
