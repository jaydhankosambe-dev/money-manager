import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api'; // Change to your API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  checkUsername: async (username) => {
    const response = await api.get(`/auth/check-username/${username}`);
    return response.data;
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

// Asset APIs
export const assetAPI = {
  getAll: async () => {
    const response = await api.get('/assets');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/assets', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },
};

// Chart APIs
export const chartAPI = {
  getChartData: async () => {
    const response = await api.get('/charts');
    return response.data;
  },
  getMonthlyEntries: async () => {
    const response = await api.get('/charts/monthly');
    return response.data;
  },
  createMonthlyEntry: async (data) => {
    const response = await api.post('/charts/monthly', data);
    return response.data;
  },
  updateMonthlyEntry: async (id, data) => {
    const response = await api.put(`/charts/monthly/${id}`, data);
    return response.data;
  },
  deleteMonthlyEntry: async (id) => {
    const response = await api.delete(`/charts/monthly/${id}`);
    return response.data;
  },
};

// Settings APIs
export const settingsAPI = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateSettings: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};

export default api;

