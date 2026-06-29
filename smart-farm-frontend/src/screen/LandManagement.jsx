import { useEffect, useState } from 'react';
import LandDetail from './LandDetail';
import ConfirmDialog from '../components/ConfirmDialog';
import { landsApi } from '../services/api';

// --- Icons ---
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const FilterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

const MountainIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
    </svg>
);

const TractorIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <circle cx="7" cy="15" r="4" />
        <circle cx="17" cy="15" r="4" />
        <path d="M3 11h18v4H3v-4z" />
        <path d="M7 11V7h4v4" />
    </svg>
);

const PlantIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M12 22v-8" />
        <path d="M12 14c-4.5 0-6-4.5-6-4.5s1.5 4.5 6 4.5" />
        <path d="M12 14c4.5 0 6-4.5 6-4.5s-1.5 4.5-6 4.5" />
        <path d="M12 14c0-4.5-3-7.5-3-7.5s3 3 3 7.5" />
    </svg>
);

const LeafIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 004.72 21C8.85 18.29 17 12 21 4c-3.5 2.5-7 3-10 1z" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const DeleteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
)

const emptyForm = { nama_lahan: '', lokasi: '', luas_lahan: '', icon: 'mountain' };

export default function LandManagement() {
    // Ambil user_id dari user yang login
    const storedUser = JSON.parse(localStorage.getItem('smart_farm_user') || '{}');
    const userId = storedUser?.id;

    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLand, setEditingLand] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedLand, setSelectedLand] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [landToDelete, setLandToDelete] = useState(null);
    const [confirmSave, setConfirmSave] = useState({ open: false, isEdit: false });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await landsApi.getAll();
            const allLands = res.data.data || [];
            const myLands = allLands.filter(l => l.user_id === userId);
            setLands(myLands);
        } catch (err) {
            console.error('Gagal memuat lahan:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLands(); }, []);

    // Normalise field names
    const normLands = lands.map(l => ({
        ...l,
        name: l.nama_lahan || l.nama || '-',
        location: l.lokasi || '-',
        area: l.luas_lahan ? `${l.luas_lahan} Ha` : '-',
        crop: l.crops?.[0]?.nama || '-',
        icon: 'mountain',
    }));

    const filteredLands = normLands.filter(land =>
        land.name.toLowerCase().includes(search.toLowerCase()) ||
        (land.crop || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleAddClick = () => {
        setEditingLand(null);
        setFormData(emptyForm);
        setFormError('');
        setShowModal(true);
    };

    const handleEditClick = (land) => {
        setEditingLand(land);
        setFormData({
            nama_lahan: land.nama_lahan || land.name || '',
            lokasi: land.lokasi || land.location || '',
            luas_lahan: land.luas_lahan || '',
            icon: land.icon || 'mountain',
        });
        setFormError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setLandToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        // Backend tidak mengizinkan hapus lahan — sembunyikan tombol saja
        setShowDeleteConfirm(false);
        setLandToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setLandToDelete(null);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setConfirmSave({ open: true, isEdit: !!editingLand });
    };

    const doSave = async () => {
        setSubmitting(true);
        setFormError('');
        try {
            const payload = {
                nama: formData.nama_lahan,
                lokasi: formData.lokasi,
                luas_lahan: formData.luas_lahan,
                user_id: userId,
                admin_id: storedUser?.admin_id || 1,
            };
            if (editingLand) {
                await landsApi.update(editingLand.id, payload);
            } else {
                await landsApi.create(payload);
            }
            await fetchLands();
            setConfirmSave({ open: false, isEdit: false });
            setShowModal(false);
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menyimpan data.';
            const errDetail = err.response?.data?.errors;
            setFormError(errDetail ? Object.values(errDetail).flat().join(' | ') : msg);
            setConfirmSave({ open: false, isEdit: false });
        } finally {
            setSubmitting(false);
        }
    };

    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'mountain': return <MountainIcon />;
            case 'tractor': return <TractorIcon />;
            case 'plant': return <PlantIcon />;
            case 'leaf': return <LeafIcon />;
            default: return <MountainIcon />;
        }
    };

    const getBadgeClass = (crop) => {
        switch (crop.toLowerCase()) {
            case 'padi': return 'badge-padi';
            case 'jagung': return 'badge-jagung';
            case 'cabai': return 'badge-cabai';
            default: return 'badge-default';
        }
    };

    if (selectedLand) {
        return <LandDetail land={selectedLand} onBack={() => { setSelectedLand(null); fetchLands(); }} />;
    }

    return (
        <div className="lm-container">
            {/* Topbar inside LandManagement to match screenshot */}
            <div className="lm-topbar">
                <div className="lm-search-container">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Cari lahan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="lm-search-input"
                    />
                </div>

                <div className="lm-topbar-right">
                    <div className="lm-avatar">👨‍🌾</div>
                </div>
            </div>

            <div className="lm-content">
                {/* Header Title & Add Button */}
                <div className="lm-header">
                    <div>
                        <h1 className="lm-title">Manajemen Lahan</h1>
                        <p className="lm-subtitle">Kelola dan pantau data lahan pertanian Anda secara presisi.</p>
                    </div>
                    <button className="lm-btn-add" onClick={handleAddClick}>
                        + Tambah Lahan
                    </button>
                </div>

                {/* Table Card */}
                <div className="lm-table-card">
                    <table className="lm-table">
                        <thead>
                            <tr>
                                <th>NAMA LAHAN</th>
                                <th>LOKASI</th>
                                <th>LUAS LAHAN</th>
                                <th>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Memuat data...</td></tr>
                            ) : filteredLands.map(land => (
                                <tr
                                    key={land.id}
                                    onClick={() => setSelectedLand(land)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <div className="lm-land-name-cell">
                                            <div className="lm-land-icon">
                                                {renderIcon(land.icon)}
                                            </div>
                                            <span className="lm-land-name">{land.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="lm-land-location">
                                            {land.location.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="lm-land-area">{land.area}</span>
                                    </td>
                                    <td>
                                        <div className="lm-actions" onClick={e => e.stopPropagation()}>
                                            <button className="lm-action-btn edit-btn" onClick={() => handleEditClick(land)}>
                                                <EditIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLands.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Tidak ada lahan yang ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="lm-pagination">
                        <span className="lm-pagination-text">Menampilkan {filteredLands.length} dari {lands.length} lahan terdaftar</span>
                        <div className="lm-pagination-controls">
                            <button className="lm-page-btn">Previous</button>
                            <button className="lm-page-btn active">1</button>
                            <button className="lm-page-btn">Next</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Widgets */}
            </div>

            {/* Footer */}
            <footer className="lm-footer">
                <div className="lm-footer-left">
                    <strong>IrigasiPintar</strong> &copy; 2024 IrigasiPintar. Precision Agriculture Systems.
                </div>
                <div className="lm-footer-right">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact</a>
                </div>
            </footer>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="lm-modal-overlay">
                    <div className="lm-modal">
                        <h2 className="lm-modal-title">{editingLand ? 'Edit Lahan' : 'Tambah Lahan'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="lm-form-group">
                                <label>Nama Lahan</label>
                                <input required type="text" value={formData.nama_lahan} onChange={e => setFormData({ ...formData, nama_lahan: e.target.value })} placeholder="Contoh: Sawah Utara" />
                            </div>
                            <div className="lm-form-group">
                                <label>Lokasi</label>
                                <input required type="text" value={formData.lokasi} onChange={e => setFormData({ ...formData, lokasi: e.target.value })} placeholder="Contoh: Desa Sukamaju" />
                            </div>
                            <div className="lm-form-group">
                                <label>Luas Lahan (Ha)</label>
                                <input required type="number" step="0.1" min="0" value={formData.luas_lahan} onChange={e => setFormData({ ...formData, luas_lahan: e.target.value })} placeholder="Contoh: 2.5" />
                            </div>
                            {formError && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', color: '#991b1b', fontSize: 13 }}>{formError}</div>
                            )}


                            <div className="lm-modal-actions">
                                <button type="button" className="lm-btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="lm-btn-submit">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Delete Confirmation — ConfirmDialog premium */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                type="danger"
                title="Hapus Lahan?"
                message="Apakah Anda yakin ingin menghapus lahan ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Hapus"
                cancelText="Tidak"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {/* Konfirmasi Simpan Lahan */}
            <ConfirmDialog
                isOpen={confirmSave.open}
                type="info"
                title={confirmSave.isEdit ? 'Simpan Perubahan Lahan?' : 'Tambah Lahan Baru?'}
                message={
                    confirmSave.isEdit
                        ? 'Apakah Anda yakin ingin menyimpan perubahan data lahan ini?'
                        : 'Apakah Anda yakin ingin menambahkan lahan baru ini?'
                }
                confirmText="Ya, Simpan"
                cancelText="Tidak"
                onConfirm={doSave}
                onCancel={() => setConfirmSave({ open: false, isEdit: false })}
            />
        </div>
    );
}
