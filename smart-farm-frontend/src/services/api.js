import axios from 'axios';

// ── Base URL Laravel (port 8001, FastAPI di 8000) ──────────────────
const BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: sertakan Bearer token jika ada ───────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_farm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 → clear token ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smart_farm_token');
      localStorage.removeItem('smart_farm_user');
      // Reload untuk kembali ke halaman login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// ─────────────────────────────────────────────────────────────────
// Resource APIs
// ─────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export const landsApi = {
  getAll: (params) => api.get('/lands', { params }),
  getOne: (id) => api.get(`/lands/${id}`),
  create: (data) => api.post('/lands', data),
  update: (id, data) => api.put(`/lands/${id}`, data),
};

export const cropsApi = {
  getAll: (params) => api.get('/crops', { params }),
  getOne: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post('/crops', data),
  update: (id, data) => api.put(`/crops/${id}`, data),
};

export const sensorsApi = {
  getAll: (params) => api.get('/sensors', { params }),
  getOne: (id) => api.get(`/sensors/${id}`),
  create: (data) => api.post('/sensors', data),
  update: (id, data) => api.put(`/sensors/${id}`, data),
};

export const predictionsApi = {
  getAll: (params) => api.get('/predictions', { params }),
  getOne: (id) => api.get(`/predictions/${id}`),
  create: (data) => api.post('/predictions', data),
};

export const activitiesApi = {
  getAll: (params) => api.get('/activities', { params }),
  getOne: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data),
};

export const adminsApi = {
  getAll: () => api.get('/admins'),
  getOne: (id) => api.get(`/admins/${id}`),
  update: (id, data) => api.put(`/admins/${id}`, data),
};

// Proxy FastAPI prediksi melalui Laravel
export const irrigationApi = {
  predict: (data) => api.post('/predict-irrigation', data),
};

export default api;
