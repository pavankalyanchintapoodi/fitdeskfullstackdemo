import axios from 'axios';

export const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me')
};

export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  renew: (id, renewalData) => api.post(`/clients/${id}/renew`, renewalData),
  recordPayment: (id, data) => api.post(`/clients/${id}/payment`, data),
  checkIn: (id, visitDate) => api.post(`/clients/${id}/check-in`, { visit_date: visitDate }),
  getHistory: (id) => api.get(`/clients/${id}/history`)
};

export const statsAPI = {
  getStats: () => api.get('/stats')
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  check: () => api.post('/notifications/check'),
  resend: (clientId, type = 'both') => api.post('/notifications/resend', { client_id: clientId, type })
};

export const exportAPI = {
  exportCSV: () => api.get('/export', { responseType: 'blob' })
};

export default api;
