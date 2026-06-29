import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiXCircle } from "react-icons/fi";
import ConfirmDialog from "../components/ConfirmDialog";
import { usersApi } from "../services/api";

const emptyForm = {
  nama: "",
  email: "",
  password: "",
  status: "aktif",
  lokasi: "",
  nim: "",
  no_phone: "",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Ambil admin_id dari user yang login
  const storedUser = JSON.parse(localStorage.getItem("smart_farm_user") || "{}");
  const adminId = storedUser?.id;

  // --- Confirm Dialog State ---
  const [confirmDelete, setConfirmDelete] = useState({ open: false, userId: null });
  const [confirmSave, setConfirmSave]     = useState({ open: false, pendingData: null, isEdit: false });

  // ── Fetch semua user dari API ──────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter((user) =>
      (user.nama || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword) ||
      (user.lokasi || "").toLowerCase().includes(keyword)
    );
  }, [search, users]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nama:     user.nama || "",
      email:    user.email || "",
      password: "",
      status:   user.status || "aktif",
      lokasi:   user.lokasi || "",
      nim:      user.nim || "",
      no_phone: user.no_phone || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, userId: id });
  };

  const doDelete = async () => {
    try {
      await usersApi.remove(confirmDelete.userId);
      setUsers(users.filter((u) => u.id !== confirmDelete.userId));
    } catch (err) {
      alert("Gagal menghapus user: " + (err.response?.data?.message || err.message));
    }
    setConfirmDelete({ open: false, userId: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmSave({ open: true, pendingData: { ...formData }, isEdit: !!editingUser });
  };

  const doSave = async () => {
    setSubmitting(true);
    setError("");
    const data = confirmSave.pendingData;
    try {
      if (confirmSave.isEdit) {
        // Jika password kosong, hapus dari payload agar tidak overwrite
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await usersApi.update(editingUser.id, payload);
      } else {
        await usersApi.create({ ...data, admin_id: adminId });
      }
      await fetchUsers();
      setShowModal(false);
      setEditingUser(null);
      setFormData(emptyForm);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan data.";
      const errDetail = err.response?.data?.errors;
      setError(errDetail ? Object.values(errDetail).flat().join(" | ") : msg);
    } finally {
      setSubmitting(false);
      setConfirmSave({ open: false, pendingData: null, isEdit: false });
    }
  };

  return (
    <div className="um-shell">
      <div className="um-toolbar um-toolbar-compact">
        <div className="um-toolbar-left">
          <div className="um-search-box">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="um-add-btn" onClick={openAddModal}>
          <FiPlus size={16} />
          Tambah User
        </button>
      </div>

      <div className="um-card">
        <div className="um-card-header">
          <div>
            <h3>Daftar Pengguna</h3>
            <p>Kelola hak akses dan status akun pengguna secara terpusat.</p>
          </div>
        </div>

        <div className="um-table-wrapper">
          {loading ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
              Memuat data...
            </div>
          ) : (
            <table className="um-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-avatar">{(user.nama || "?").charAt(0)}</div>
                          <strong>{user.nama}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.lokasi || "-"}</td>
                      <td>
                        <span className={`um-status ${user.status === "aktif" ? "status-active" : "status-inactive"}`}>
                          {user.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td>
                        <div className="um-actions">
                          <button className="um-action-btn edit" onClick={() => openEditModal(user)}>
                            <FiEdit2 size={15} />
                          </button>
                          <button className="um-action-btn delete" onClick={() => handleDelete(user.id)}>
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="um-empty-state">
                        <p>Tidak ada pengguna yang cocok dengan pencarian.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="um-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="um-modal" onClick={(e) => e.stopPropagation()}>
            <div className="um-modal-header">
              <div>
                <h3>{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
                <p>{editingUser ? "Perbarui data akun pengguna" : "Buat akun baru untuk petani"}</p>
              </div>
              <button className="um-close-btn" onClick={() => setShowModal(false)}>
                <FiXCircle size={18} />
              </button>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#991b1b", fontSize: 13 }}>
                {error}
              </div>
            )}

            <form className="um-form" onSubmit={handleSubmit}>
              <div className="um-form-group">
                <label>Nama</label>
                <input required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama" />
              </div>

              <div className="um-form-group">
                <label>Email</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="nama@email.com" />
              </div>

              <div className="um-form-group">
                <label>NIM</label>
                <input required value={formData.nim} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} placeholder="Nomor Induk Mahasiswa" />
              </div>

              <div className="um-form-group">
                <label>No. HP</label>
                <input required value={formData.no_phone} onChange={(e) => setFormData({ ...formData, no_phone: e.target.value })} placeholder="08xxxxxxxxxx" />
              </div>

              <div className="um-form-group">
                <label>Lokasi</label>
                <input value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} placeholder="Contoh: Bandung" />
              </div>

              <div className="um-form-group">
                <label>Password {editingUser && <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>(kosongkan jika tidak diubah)</span>}</label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? "Isi hanya jika ingin mengubah" : "Masukkan password (min. 8 karakter)"}
                />
              </div>

              <div className="um-form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
                </select>
              </div>

              <div className="um-modal-actions">
                <button type="button" className="um-btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="um-btn-primary" disabled={submitting}>
                  {submitting ? "Menyimpan..." : editingUser ? "Simpan Perubahan" : "Simpan User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        type="danger"
        title="Hapus Pengguna?"
        message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Tidak"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete({ open: false, userId: null })}
      />

      {/* Konfirmasi Simpan */}
      <ConfirmDialog
        isOpen={confirmSave.open}
        type="info"
        title={confirmSave.isEdit ? "Simpan Perubahan?" : "Tambah Pengguna?"}
        message={confirmSave.isEdit ? "Apakah Anda yakin ingin menyimpan perubahan data pengguna ini?" : "Apakah Anda yakin ingin menambahkan pengguna baru ini?"}
        confirmText="Ya, Simpan"
        cancelText="Tidak"
        onConfirm={doSave}
        onCancel={() => setConfirmSave({ open: false, pendingData: null, isEdit: false })}
      />
    </div>
  );
}
