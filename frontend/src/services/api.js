// src/services/api.js - Backend Connection Service
import axios from 'axios';

// Backend API base URL - UPDATE THIS TO YOUR BACKEND URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Notes API calls
export const notesAPI = {
  getAllNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  
  createNote: async (title, content) => {
    const response = await api.post('/notes', { title, content });
    return response.data;
  },
  
  updateNote: async (id, title, content) => {
    const response = await api.put(`/notes/${id}`, { title, content });
    return response.data;
  },
  
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
  
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  }
};

// Admin/Users API calls
export const usersAPI = {
  inviteUser: async (email, role = 'member') => {
    const response = await api.post('/users/invite', { email, role });
    return response.data;
  },
  
  getTenantUsers: async () => {
    const response = await api.get('/users/tenant-users');
    return response.data;
  }
};

// Tenant API calls
export const tenantAPI = {
  upgradeTenant: async (slug) => {
    const response = await api.post(`/tenants/${slug}/upgrade`);
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  }
};

export default api;