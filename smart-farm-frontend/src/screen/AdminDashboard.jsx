import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import DashboardHeader from "../components/admin/DashboardHeader";
import StatisticCard from "../components/admin/StatisticCard";
import SummaryTable from "../components/admin/SummaryTable";
import RecentActivity from "../components/admin/RecentActivity";
import UserManagement from "./UserManagement";
import MonitoringLahan from "./MonitoringLahan";
import MonitoringSensor from "./MonitoringSensor";
import { FiUsers, FiMapPin, FiDatabase, FiAlertTriangle } from "react-icons/fi";
import { usersApi, landsApi, sensorsApi } from "../services/api";

export default function AdminDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("Dashboard");
  const [stats, setStats] = useState({ users: 0, lands: 0, sensors: 0, critical: 0 });

  useEffect(() => {
    if (activeView !== "Dashboard") return;
    Promise.all([
      usersApi.getAll(),
      landsApi.getAll(),
      sensorsApi.getAll(),
    ]).then(([usersRes, landsRes, sensorsRes]) => {
      const sensors = sensorsRes.data.data || [];
      const critical = sensors.filter(s => {
        const cond = s.prediction?.status_kondisi || "";
        return cond.toLowerCase().includes("irigasi");
      }).length;
      setStats({
        users: (usersRes.data.data || []).length,
        lands: (landsRes.data.data || []).length,
        sensors: sensors.length,
        critical,
      });
    }).catch(console.error);
  }, [activeView]);

  const renderContent = () => {
    if (activeView === "Kelola Pengguna") return <UserManagement />;
    if (activeView === "Monitoring Lahan") return <MonitoringLahan />;
    if (activeView === "Monitoring Sensor") return <MonitoringSensor />;

    return (
      <>
        <div className="admin-dashboard-stats-grid">
          <StatisticCard
            icon={<FiUsers size={26} strokeWidth={2} />}
            iconBg="#3E7E44"
            titleColor="#3E7E44"
            accentColor="#3E7E44"
            title="TOTAL PENGGUNA"
            value={String(stats.users)}
            description="Petani terdaftar"
          />
          <StatisticCard
            icon={<FiMapPin size={26} strokeWidth={2} />}
            iconBg="#2563EB"
            titleColor="#2563EB"
            accentColor="#2563EB"
            title="TOTAL LAHAN"
            value={String(stats.lands)}
            description="Dari seluruh petani"
          />
          <StatisticCard
            icon={<FiDatabase size={26} strokeWidth={2} />}
            iconBg="#7C3AED"
            titleColor="#7C3AED"
            accentColor="#7C3AED"
            title="TOTAL SENSOR"
            value={String(stats.sensors)}
            description="Total pencatatan"
          />
          <StatisticCard
            icon={<FiAlertTriangle size={26} strokeWidth={2} />}
            iconBg="#EA580C"
            titleColor="#EA580C"
            accentColor="#EA580C"
            title="LAHAN KRITIS"
            value={String(stats.critical)}
            description="Perlu penyiraman"
          />
        </div>

        <div className="admin-dashboard-sections">
          <SummaryTable />
          <RecentActivity />
        </div>
      </>
    );
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar user={user} onLogout={onLogout} activeItem={activeView} onNavigate={setActiveView} />

      <main className="admin-dashboard-main">
        <div className="admin-dashboard-content">
          <DashboardHeader
            title={
              activeView === "Kelola Pengguna" ? "Kelola Pengguna"
              : activeView === "Monitoring Lahan" ? "Monitoring Lahan"
              : activeView === "Monitoring Sensor" ? "Monitoring Sensor"
              : "Dashboard Admin"
            }
            subtitle={
              activeView === "Kelola Pengguna" ? "Kelola akun pengguna, peran, dan status akses secara terpusat"
              : activeView === "Monitoring Lahan" ? "Seluruh data lahan dari semua petani"
              : activeView === "Monitoring Sensor" ? "Seluruh data sensor dari semua lahan"
              : "Ringkasan seluruh sistem irigasi pintar"
            }
            showSearch={activeView === "Dashboard"}
            compactTitle={activeView !== "Dashboard"}
          />
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
