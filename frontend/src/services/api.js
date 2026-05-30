import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerAdmin: (data) => api.post('/auth/register/admin', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.put('/profile/avatar', formData);
  },
  addSkill: (skillName) => api.post('/profile/skills', { name: skillName }),
  removeSkill: (skillId) => api.delete(`/profile/skills/${skillId}`),
};

export const libraryAPI = {
  getMaterials: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/library/materials?${params}`);
  },
  getMaterial: (id) => api.get(`/library/materials/${id}`),
  downloadMaterial: (id) => api.post(`/library/materials/${id}/download`),
  uploadMaterial: (formData) => api.post('/library/materials', formData),
  rateMaterial: (id, data) => api.post(`/library/materials/${id}/rate`, data),
  deleteMaterial: (id) => api.delete(`/library/materials/${id}`),
};

export const alumniAPI = {
  getAlumni: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return api.get(`/alumni?${params}`);
  },
  getAlumniDetail: (id) => api.get(`/alumni/${id}`),
  createAlumni: (data) => api.post('/alumni', data),
  updateAlumni: (id, data) => api.put(`/alumni/${id}`, data),
  deleteAlumni: (id) => api.delete(`/alumni/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
