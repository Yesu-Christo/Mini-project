import axios from 'axios';

// ---------------------------------------------------------------------------
// Configuration — read from environment variables (set in frontend/.env)
// ---------------------------------------------------------------------------
const BASE_URL    = import.meta.env.VITE_API_BASE_URL  || '/api';
const TIMEOUT     = Number(import.meta.env.VITE_API_TIMEOUT) || 60000;
const TOKEN_KEY   = import.meta.env.VITE_TOKEN_KEY     || 'cs_token';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login          = (data) => api.post('/accounts/login/', data);
export const register       = (data) => api.post('/accounts/register/', data);
export const forgotPassword = (data) => api.post('/accounts/forgot-password/', data);
export const resetPassword  = (data) => api.post('/accounts/reset-password/', data);
export const getUsers       = ()     => api.get('/accounts/');

// Incidents
export const getIncidents          = ()     => api.get('/incidents/');
export const createIncident        = (data) => api.post('/incidents/', data);
export const activateEmergency     = (data) => api.post('/incidents/emergency/', data);
export const updateIncidentStatus  = (incidentId, status) => api.patch(`/incidents/${incidentId}/`, { status });

// Prediction
export const runPrediction   = (data) => api.post('/prediction/', data);

// Alerts
export const getAlerts       = ()     => api.get('/alerts/');
export const createAlert     = (data) => api.post('/alerts/', data);
export const getNotifications = ()     => api.get('/alerts/notifications/');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats/');

export default api;
