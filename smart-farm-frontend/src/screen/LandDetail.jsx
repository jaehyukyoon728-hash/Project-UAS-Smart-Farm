import React, { useEffect, useState, useRef } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { cropsApi, irrigationApi, predictionsApi } from '../services/api';

// --- Icons ---
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LocationPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 004.72 21C8.85 18.29 17 12 21 4c-3.5 2.5-7 3-10 1z" />
  </svg>
);

const MoistureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const TempIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
  </svg>
);

const HumidityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const UpdateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.3" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, marginRight: 6 }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 4 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 4 }}>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 4 }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const CheckboxSquareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

export default function LandDetail({ land, onBack }) {
  const storedUser = JSON.parse(localStorage.getItem('smart_farm_user') || '{}');
  // admin_id: untuk farmer, ambil dari admin_id-nya; untuk admin langsung id-nya
  const adminId = storedUser?.admin_id || storedUser?.id;

  const [activeTab, setActiveTab] = useState('Jenis Tanaman');
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);

  // Crops/tanaman milik lahan ini (dari API)
  const [plants, setPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);

  // Riwayat prediksi (dari API)
  const [histories, setHistories] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [landStats, setLandStats] = useState({
    avgMoi: '-',
    avgTemp: '-',
    avgHumidity: '-',
    lastUpdate: '-'
  });

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return date.toLocaleDateString('id-ID');
  };

  // State prediksi
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState('');

  // Slider state
  const [sliderMoisture, setSliderMoisture] = useState(35);
  const [sliderHumidity, setSliderHumidity] = useState(55);
  const [sliderTemp, setSliderTemp] = useState(28);

  const [confirmAddPlant, setConfirmAddPlant] = useState({ open: false, pendingData: null });
  const [confirmPredict, setConfirmPredict]   = useState({ open: false, pendingFn: null });
  const predictFormRef = useRef(null);
  const addPlantFormRef = useRef(null);

  // ── Fetch crops milik lahan ini ─────────────────────────────────
  const fetchCrops = () => {
    setLoadingPlants(true);
    cropsApi.getAll({ land_id: land.id })
      .then(res => {
        const crops = res.data.data || [];
        setPlants(crops.map(c => {
          const latestSensor = c.sensors && c.sensors.length > 0 ? c.sensors[c.sensors.length - 1] : null;
          return {
            id: c.id,
            crop: c.nama || c.crop || '-',
            phase: c.fase_pertumbuhan || c.phase || '-',
            moisture: latestSensor?.moi ?? '-',
            humidity: latestSensor?.kelembaban_udara ?? '-',
            temp: latestSensor?.tempt ?? '-',
          };
        }));

        // Calculate averages from all historical sensor data recorded on this land
        const allSensors = crops.flatMap(c => c.sensors || []);
        if (allSensors.length > 0) {
          const totalMoi = allSensors.reduce((sum, s) => sum + parseFloat(s.moi || 0), 0);
          const totalTemp = allSensors.reduce((sum, s) => sum + parseFloat(s.tempt || 0), 0);
          const totalHumidity = allSensors.reduce((sum, s) => sum + parseFloat(s.kelembaban_udara || 0), 0);

          const avgMoi = Math.round(totalMoi / allSensors.length);
          const avgTemp = Math.round(totalTemp / allSensors.length);
          const avgHumidity = Math.round(totalHumidity / allSensors.length);

          const sortedSensors = [...allSensors].sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
          const latest = sortedSensors[0];
          const lastUpdateText = latest ? formatTimeAgo(new Date(latest.created_at || latest.updated_at)) : '-';

          setLandStats({
            avgMoi: `${avgMoi}%`,
            avgTemp: `${avgTemp}°C`,
            avgHumidity: `${avgHumidity}%`,
            lastUpdate: lastUpdateText
          });
        } else {
          setLandStats({
            avgMoi: '-',
            avgTemp: '-',
            avgHumidity: '-',
            lastUpdate: '-'
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoadingPlants(false));
  };

  // ── Fetch riwayat prediksi milik lahan ini ──────────────────────
  const fetchHistory = () => {
    setLoadingHistory(true);
    predictionsApi.getAll({ land_id: land.id })
      .then(res => {
        const data = res.data.data || [];
        setHistories(data.map(p => ({
          id: p.id,
          date: new Date(p.created_at || p.tanggal_pencatatan).toLocaleString('id-ID'),
          crop: p.sensor?.crop?.nama || '-',
          moisture: p.sensor?.moi ?? '-',
          humidity: p.sensor?.kelembaban_udara ?? '-',
          temp: p.sensor?.tempt ?? '-',
          phase: p.sensor?.tahap_pertumbuhan || '-',
          predictionTitle: p.status_kondisi || '-',
          predictionDesc: p.rekomendasi || '-',
          rf: p.rf,
          kmeans: p.kmeans,
        })).reverse());
      })
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    fetchCrops();
    fetchHistory();
  }, [land.id]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Butuh Irigasi': 
        return <span className="ld-status-badge badge-danger"><WarningIcon/> {status}</span>;
      case 'Normal': 
        return <span className="ld-status-badge badge-success"><CheckIcon/> {status}</span>;
      case 'Monitoring': 
        return <span className="ld-status-badge badge-warning"><ActivityIcon/> {status}</span>;
      default: 
        return <span className="ld-status-badge badge-default">{status}</span>;
    }
  };

  return (
    <div className="ld-container">
      {/* Topbar */}
      <div className="lm-topbar">
        <div className="lm-search-container" style={{ width: '400px' }}>
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search farmland, crops, or data..." 
            className="lm-search-input"
          />
        </div>
        
        <div className="lm-topbar-right">
          <div className="lm-avatar">👨‍🌾</div>
        </div>
      </div>

      <div className="ld-content">
        {/* Back Button (Added for usability although not fully prominent in screenshot) */}
        <button className="ld-back-btn" onClick={onBack}>
          <ArrowLeftIcon /> Kembali
        </button>

        {/* Header */}
        <div className="ld-header-row">
          <div>
            <div className="ld-location">
              <LocationPinIcon /> {land.location.toUpperCase()}
            </div>
            <h1 className="ld-title">{land.name}</h1>
          </div>
          <button className="ld-btn-primary" onClick={() => setShowAddPlantModal(true)}>
            + Tambah Tanaman
          </button>
        </div>

        {/* Stats Grid */}
        <div className="ld-stats-grid">
          {/* Card 1: Kelembapan */}
          <div className="ld-stat-card">
            <div className="ld-stat-header">
              <span className="ld-stat-title">Kelembapan Tanah</span>
              <div className="ld-stat-icon icon-blue"><MoistureIcon /></div>
            </div>
            <div className="ld-stat-value">{landStats.avgMoi}</div>
            <div className="ld-stat-desc">Rata-rata kelembapan tanah</div>
          </div>

          {/* Card 2: Suhu */}
          <div className="ld-stat-card">
            <div className="ld-stat-header">
              <span className="ld-stat-title">Suhu</span>
              <div className="ld-stat-icon icon-green"><TempIcon /></div>
            </div>
            <div className="ld-stat-value">{landStats.avgTemp}</div>
            <div className="ld-stat-desc">Rata-rata suhu tanah</div>
          </div>

          {/* Card 3: Kelembapan Udara */}
          <div className="ld-stat-card">
            <div className="ld-stat-header">
              <span className="ld-stat-title">Kelembapan Udara</span>
              <div className="ld-stat-icon icon-gray"><HumidityIcon /></div>
            </div>
            <div className="ld-stat-value">{landStats.avgHumidity}</div>
            <div className="ld-stat-desc">Rata-rata kelembapan udara</div>
          </div>

          {/* Card 4: Update Terakhir */}
          <div className="ld-stat-card">
            <div className="ld-stat-header">
              <span className="ld-stat-title">Update Terakhir</span>
              <div className="ld-stat-icon icon-gray"><UpdateIcon /></div>
            </div>
            <div className="ld-stat-value" style={{ fontSize: '20px', padding: '4px 0' }}>{landStats.lastUpdate}</div>
            <div className="ld-stat-desc">Otomatis dari sensor terbaru</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ld-tabs">
          {['Jenis Tanaman', 'Riwayat Prediksi'].map(tab => (
            <button 
              key={tab}
              className={`ld-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Area */}
        <div className="ld-table-container">
          {activeTab === 'Jenis Tanaman' ? (
            <table className="ld-table">
              <thead>
                <tr>
                  <th>Tanaman</th>
                  <th>Fase Pertumbuhan</th>
                  <th>Kelembapan Tanah</th>
                  <th>Kelembapan Udara</th>
                  <th>Suhu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {plants.map(row => (
                  <tr key={row.id}>
                    <td><span className={`lm-crop-badge badge-${row.crop.toLowerCase()}`}>{row.crop}</span></td>
                    <td>{row.phase}</td>
                    <td>{row.moisture}%</td>
                    <td>{row.humidity}%</td>
                    <td>{row.temp}°C</td>
                    <td>
                      <div className="ld-actions" style={{ display: 'flex', gap: '12px' }}>
                        <button className="ld-action-btn" onClick={() => {
                          setSelectedPlant(row);
                          setSliderMoisture(parseInt(row.moisture) || 35);
                          setSliderHumidity(parseInt(row.humidity) || 55);
                          setSliderTemp(parseInt(row.temp) || 28);
                          setShowPredictModal(true);
                        }} title="Edit"><EditIcon/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="ld-table">
              <thead>
                <tr>
                  <th>Tanggal & Waktu</th>
                  <th>Tanaman</th>
                  <th>Prediksi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {histories.map(row => (
                  <tr key={row.id} onClick={() => { setSelectedHistory(row); setShowHistoryDetailModal(true); }} style={{ cursor: 'pointer' }}>
                    <td className="font-bold">{row.date}</td>
                    <td><span className={`lm-crop-badge badge-${row.crop.toLowerCase()}`}>{row.crop}</span></td>
                    <td>{(row.predictionTitle || row.prediction || '').length > 50 ? (row.predictionTitle || row.prediction || '').substring(0, 50) + '...' : (row.predictionTitle || row.prediction || '')}</td>
                    <td>
                      <div className="ld-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => { setSelectedHistory(row); setShowHistoryDetailModal(true); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2d6a35',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            textDecoration: 'underline'
                          }}
                        >
                          Detail Prediksi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="lm-footer">
        <div className="lm-footer-left">
          &copy; 2024 IrigasiPintar. Precision Agriculture Systems.
        </div>
        <div className="lm-footer-right">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>

      {/* Tambah Tanaman Modal */}
      {showAddPlantModal && (
        <div className="ld-modal-overlay">
          <div className="ld-modal" style={{ padding: '28px', maxWidth: '420px', width: '90%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '16px' }}>
            <div className="ld-modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #f3f4f6', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="ld-modal-title" style={{fontSize: '18px', fontWeight: 'bold'}}>Tambah Tanaman</h2>
              <button className="ld-modal-close" onClick={() => setShowAddPlantModal(false)}><XIcon /></button>
            </div>
            
            <form ref={addPlantFormRef} onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const pendingData = { crop: formData.get('crop'), soil: formData.get('soil') };
              setConfirmAddPlant({ open: true, pendingData });
            }}>
              <div className="ld-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="ld-form-group">
                  <label className="ld-form-label" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#1f2937' }}>Jenis Tanaman</label>
                  <select name="crop" required className="ld-form-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none', color: '#1f2937', fontSize: '14px', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '16px' }}>
                    <option value="" disabled selected>Pilih Tanaman</option>
                    <option value="Gandum">Gandum</option>
                    <option value="Cabai">Cabai</option>
                    <option value="Wortel">Wortel</option>
                    <option value="Kentang">Kentang</option>
                    <option value="Tomat">Tomat</option>
                  </select>
                </div>
                
                <div className="ld-form-group">
                  <label className="ld-form-label" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#1f2937' }}>Jenis Tanah</label>
                  <select name="soil" required className="ld-form-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none', color: '#1f2937', fontSize: '14px', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '16px' }}>
                    <option value="" disabled selected>Pilih Jenis Tanah</option>
                    <option value="Tanah Liat">Tanah Liat</option>
                    <option value="Tanah Pasir">Tanah Pasir</option>
                    <option value="Tanah Merah">Tanah Merah</option>
                    <option value="Tanah Lempung">Tanah Lempung</option>
                    <option value="Tanah Hitam">Tanah Hitam</option>
                    <option value="Tanah Aluvial">Tanah Aluvial</option>
                    <option value="Tanah Pesisir">Tanah Pesisir</option>
                  </select>
                </div>
              </div>

              <div className="ld-modal-footer" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="ld-btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#325b39', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Tambah Tanaman</button>
                <button type="button" className="ld-btn-outline" onClick={() => setShowAddPlantModal(false)} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px', color: '#1f2937' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prediksi & Update Modal */}
      {showPredictModal && selectedPlant && (
        <div className="ld-modal-overlay">
          <div className="ld-modal" style={{ padding: '28px', maxWidth: '420px', width: '90%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '16px' }}>
            <div className="ld-modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #f3f4f6', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="ld-modal-title" style={{fontSize: '18px', fontWeight: 'bold', margin: 0}}>Perbarui Prediksi</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>{selectedPlant.crop}</p>
              </div>
              <button className="ld-modal-close" onClick={() => setShowPredictModal(false)}><XIcon /></button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const phase = formData.get('phase');

              // Kumpulkan sebagai pendingFn agar bisa di-konfirmasi dulu
              const pendingFn = async () => {
                setPredicting(true);
                setPredictError('');
                try {
                  const res = await irrigationApi.predict({
                    land_id:        land.id,
                    crop_id:        selectedPlant.id,
                    seedling_stage: phase,
                    moi:            sliderMoisture,
                    temp:           sliderTemp,
                    humidity:       sliderHumidity,
                    admin_id:       adminId,
                  });

                  // Refresh all data from database (recalculates stats and fetches updated history)
                  fetchCrops();
                  fetchHistory();

                  // Tambah ke riwayat lokal
                  const pred = res.data.prediction;
                  setHistories(prev => [{
                    id: pred.id || Date.now(),
                    date: new Date().toLocaleString('id-ID'),
                    crop: selectedPlant.crop,
                    moisture: sliderMoisture,
                    humidity: sliderHumidity,
                    temp: sliderTemp,
                    phase,
                    predictionTitle: pred.status_kondisi || res.data.rf?.prediction_label || '-',
                    predictionDesc:  pred.rekomendasi || res.data.recommendation?.detail || '-',
                    rf: pred.rf || res.data.rf,
                    kmeans: pred.kmeans || res.data.kmeans,
                  }, ...prev]);

                  setShowPredictModal(false);
                  setActiveTab('Riwayat Prediksi');
                } catch (err) {
                  const msg = err.response?.data?.message || 'Prediksi gagal. Pastikan FastAPI berjalan.';
                  setPredictError(msg);
                } finally {
                  setPredicting(false);
                }
              };
              setConfirmPredict({ open: true, pendingFn });
            }}>
              <div className="ld-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Fase Pertumbuhan - Dropdown */}
                <div className="ld-form-group">
                  <label className="ld-form-label" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Fase Pertumbuhan</label>
                  <select name="phase" defaultValue={selectedPlant.phase !== '-' ? selectedPlant.phase : ''} required className="ld-form-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none', color: '#1f2937', fontSize: '14px', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '16px', cursor: 'pointer' }}>
                    <option value="" disabled>Pilih Fase Pertumbuhan</option>
                    <option value="Perkecambahan">Perkecambahan</option>
                    <option value="Tahap Bibit">Tahap Bibit</option>
                    <option value="Umbi">Umbi</option>
                    <option value="Pembungaan">Pembungaan</option>
                    <option value="Penyerbukan">Penyerbukan</option>
                    <option value="Pembentukan Buah">Pembentukan Buah</option>
                    <option value="Pematangan Buah">Pematangan Buah</option>
                    <option value="Pemanenan">Pemanenan</option>
                  </select>
                </div>

                {/* Kelembapan Tanah - Range Slider */}
                <div className="ld-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="ld-form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Kelembapan Tanah</label>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#325b39', background: '#ecfdf5', padding: '2px 10px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>{sliderMoisture}<span style={{ fontSize: '12px', fontWeight: '500' }}>%</span></span>
                  </div>
                  <input
                    type="range"
                    min="1" max="100"
                    value={sliderMoisture}
                    onChange={(e) => setSliderMoisture(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#325b39', height: '6px', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    <span>1%</span><span>100%</span>
                  </div>
                </div>

                {/* Kelembapan Udara - Range Slider */}
                <div className="ld-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="ld-form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Kelembapan Udara</label>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1d4ed8', background: '#eff6ff', padding: '2px 10px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>{sliderHumidity}<span style={{ fontSize: '12px', fontWeight: '500' }}>%</span></span>
                  </div>
                  <input
                    type="range"
                    min="19" max="91"
                    value={sliderHumidity}
                    onChange={(e) => setSliderHumidity(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#1d4ed8', height: '6px', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    <span>19%</span><span>91%</span>
                  </div>
                </div>

                {/* Suhu - Range Slider */}
                <div className="ld-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label className="ld-form-label" style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Suhu</label>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#b45309', background: '#fffbeb', padding: '2px 10px', borderRadius: '20px', border: '1px solid #fde68a' }}>{sliderTemp}<span style={{ fontSize: '12px', fontWeight: '500' }}>°C</span></span>
                  </div>
                  <input
                    type="range"
                    min="13" max="46"
                    value={sliderTemp}
                    onChange={(e) => setSliderTemp(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#b45309', height: '6px', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    <span>13°C</span><span>46°C</span>
                  </div>
                </div>

              </div>

              <div className="ld-modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                {predictError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#991b1b', fontSize: 13 }}>
                    ⚠️ {predictError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={predicting} className="ld-btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: predicting ? '#9ca3af' : '#325b39', color: 'white', fontWeight: '600', border: 'none', cursor: predicting ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                    {predicting ? '⏳ Mengirim ke FastAPI...' : 'Simpan & Prediksi'}
                  </button>
                  <button type="button" className="ld-btn-outline" onClick={() => { setShowPredictModal(false); setPredictError(''); }} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px', color: '#1f2937' }}>Batal</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Detail Modal */}
      {showHistoryDetailModal && selectedHistory && (
        <div className="ld-modal-overlay">
          <div className="ld-modal" style={{ padding: '0', maxWidth: '420px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
 
            {/* Modal Header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>Detail Riwayat Prediksi</h2>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8' }}>Ringkasan data dan rekomendasi sistem</p>
              </div>
              <button className="ld-modal-close" onClick={() => setShowHistoryDetailModal(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', display: 'flex', cursor: 'pointer', color: '#64748b' }}><XIcon /></button>
            </div>
 
            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', overflowY: 'auto', flex: 1 }}>
 
              {/* Baris 1: Tanggal & Jam | Tanaman & Fase */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '10.5px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tanggal &amp; Jam</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: 1.4 }}>{selectedHistory.date}</p>
                </div>
                <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '10.5px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tanaman &amp; Fase</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{selectedHistory.crop}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{selectedHistory.phase}</p>
                </div>
              </div>
 
              {/* Baris 2: 3 Variabel Sensor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Kelembapan Tanah', value: `${selectedHistory.moisture}%` },
                  { label: 'Kelembapan Udara', value: `${selectedHistory.humidity}%` },
                  { label: 'Suhu', value: `${selectedHistory.temp}°C` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '14px 12px', background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '10.5px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{label}</p>
                    <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.02em' }}>{value}</p>
                  </div>
                ))}
              </div>
 
              {/* Baris 3: Prediksi Irigasi */}
              <div style={{ padding: '16px 18px', background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '10.5px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Prediksi Irigasi</p>
                {(() => {
                  const title = selectedHistory.predictionTitle || selectedHistory.prediction || '';
                  let bg = '#f0fdf4', color = '#166534', border = '#dcfce7', dot = '#22c55e';
                  if (title === 'Perlu Irigasi') {
                    bg = '#fef2f2'; color = '#991b1b'; border = '#fee2e2'; dot = '#ef4444';
                  } else if (title === 'Tidak Perlu Irigasi') {
                    bg = '#f0fdf4'; color = '#166534'; border = '#dcfce7'; dot = '#22c55e';
                  } else if (title === 'Kondisi Khusus') {
                    bg = '#fefce8'; color = '#854d0e'; border = '#fef9c3'; dot = '#eab308';
                  }
                  return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: bg, border: `1px solid ${border}`, borderRadius: '99px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0, boxShadow: `0 0 0 3px ${dot}30` }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color }}>{title}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Baris Baru: Output FastAPI (RF & K-Means) */}
              {selectedHistory.rf && (
                <div style={{ padding: '16px 18px', background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '10.5px', fontWeight: '600', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.07em' }}>🤖 Analisis Random Forest (FastAPI)</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#111827' }}>
                    <span>Label Prediksi:</span>
                    <strong>{selectedHistory.rf.prediction_label}</strong>
                  </div>
                  {selectedHistory.rf.confidence !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#111827', marginTop: '4px' }}>
                      <span>Tingkat Keyakinan:</span>
                      <strong>{(selectedHistory.rf.confidence * 100).toFixed(1)}%</strong>
                    </div>
                  )}
                </div>
              )}

              {selectedHistory.kmeans && (
                <div style={{ padding: '16px 18px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '10.5px', fontWeight: '600', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.07em' }}>📊 Klusterisasi K-Means (FastAPI)</p>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '14px', fontWeight: '700', color: '#5b21b6', marginBottom: '6px' }}>
                    <span>{selectedHistory.kmeans.cluster_emoji}</span>
                    <span>{selectedHistory.kmeans.cluster_name}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#4c1d95', lineHeight: 1.5 }}>
                    {selectedHistory.kmeans.description}
                  </p>
                  {selectedHistory.kmeans.cluster_avg && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #ddd6fe', fontSize: '12px', color: '#6d28d9' }}>
                      <div>Rerata Kelembapan: <strong>{selectedHistory.kmeans.cluster_avg.moi}%</strong></div>
                      <div>Rerata Suhu: <strong>{selectedHistory.kmeans.cluster_avg.temp}°C</strong></div>
                    </div>
                  )}
                </div>
              )}

              {/* Baris 4: Rekomendasi Smart Farming */}
              <div style={{ padding: '16px 18px', background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '10.5px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>💡 Rekomendasi Smart Farming</p>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: '1.8', fontWeight: '400' }}>
                  {selectedHistory.predictionDesc || 'Tidak ada deskripsi tersedia.'}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 28px 22px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => setShowHistoryDetailModal(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#1e293b', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '0.01em', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
              >Tutup</button>
            </div>

          </div>
        </div>
      )}

      {/* ── Konfirmasi Tambah Tanaman ── */}
      <ConfirmDialog
        isOpen={confirmAddPlant.open}
        type="info"
        title="Tambah Tanaman?"
        message="Apakah Anda yakin ingin menambahkan tanaman baru ke lahan ini?"
        confirmText="Ya, Tambah"
        cancelText="Tidak"
        onConfirm={async () => {
          const d = confirmAddPlant.pendingData;
          if (d) {
            try {
              await cropsApi.create({
                land_id: land.id,
                nama: d.crop,
                jenis_tanah: d.soil
              });
              fetchCrops();
            } catch (err) {
              alert("Gagal menambahkan tanaman: " + (err.response?.data?.message || err.message));
            }
          }
          setConfirmAddPlant({ open: false, pendingData: null });
          setShowAddPlantModal(false);
        }}
        onCancel={() => setConfirmAddPlant({ open: false, pendingData: null })}
      />

      {/* ── Konfirmasi Simpan & Prediksi ── */}
      <ConfirmDialog
        isOpen={confirmPredict.open}
        type="warning"
        title="Simpan & Jalankan Prediksi?"
        message="Apakah Anda yakin ingin menyimpan data sensor dan menjalankan prediksi irigasi untuk tanaman ini?"
        confirmText="Ya, Prediksi"
        cancelText="Tidak"
        onConfirm={() => {
          if (confirmPredict.pendingFn) confirmPredict.pendingFn();
          setConfirmPredict({ open: false, pendingFn: null });
        }}
        onCancel={() => setConfirmPredict({ open: false, pendingFn: null })}
      />
    </div>
  );
}
