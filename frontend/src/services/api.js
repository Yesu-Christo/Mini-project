import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login    = (data) => api.post('/accounts/login/', data);
export const register = (data) => api.post('/accounts/register/', data);

// Incidents
export const getIncidents    = ()     => api.get('/incidents/');
export const createIncident  = (data) => api.post('/incidents/', data);

// Prediction
export const runPrediction   = (data) => api.post('/prediction/', data);

// Alerts
export const getAlerts       = ()     => api.get('/alerts/');
export const createAlert     = (data) => api.post('/alerts/', data);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats/');

export default api;
