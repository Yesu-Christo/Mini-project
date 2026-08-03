import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';

// Pages
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import IncidentHistory from './pages/IncidentHistory';
import Prediction     from './pages/Prediction';
import HeatMap        from './pages/HeatMap';
import Alerts         from './pages/Alerts';
import Users          from './pages/Users';
import Profile        from './pages/Profile';
import Settings       from './pages/Settings';
import NotFound       from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index             element={<Dashboard />} />
        <Route path="report"     element={<ReportIncident />} />
        <Route path="incidents"  element={<IncidentHistory />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="heatmap"    element={<HeatMap />} />
        <Route path="alerts"     element={<Alerts />} />
        <Route path="users"      element={<Users />} />
        <Route path="profile"    element={<Profile />} />
        <Route path="settings"   element={<Settings />} />
        <Route path="*"          element={<NotFound />} />
      </Route>
    </Routes>
  );
}
