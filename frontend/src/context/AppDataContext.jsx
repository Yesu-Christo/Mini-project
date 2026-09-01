/**
 * AppDataContext — single source of truth for live app data.
 *
 * All pages that read incidents, alerts, or dashboard stats
 * pull from this context. When a new incident or alert is
 * submitted, the submitting page calls addIncident() / addAlert()
 * here, and every listening page re-renders automatically.
 */
import React, {
  createContext, useContext, useState,
  useCallback, useEffect, useRef
} from 'react';
import {
  getDashboardStats,
  getIncidents,
  getAlerts,
  getNotifications,
  updateIncidentStatus,
} from '../services/api';

// ─── Empty live state (default when backend is not connected yet) ────────
const EMPTY_INCIDENTS = [];

const EMPTY_ALERTS = [];

const EMPTY_STATS = {
  total_incidents: 0,
  todays_incidents: 0,
  high_risk_areas_count: 0,
  prediction_accuracy: '0%',
  active_alerts_count: 0,
};

const EMPTY_RISK_ZONES = [];

// ─── Context ──────────────────────────────────────────────────────────────
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [incidents,  setIncidents]  = useState(EMPTY_INCIDENTS);
  const [alerts,     setAlerts]     = useState(EMPTY_ALERTS);
  const [notifications, setNotifications] = useState([]);
  const [stats,      setStats]      = useState(EMPTY_STATS);
  const [riskZones,  setRiskZones]  = useState(EMPTY_RISK_ZONES);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const seeded = useRef(false);

  // ── Initial load from API ──────────────────────────────────────────────
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    Promise.allSettled([
      getDashboardStats(),
      getIncidents(),
      getAlerts(),
      getNotifications(),
    ]).then(([statsRes, incRes, alertRes, notificationRes]) => {
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
        if (statsRes.value.data.high_risk_areas)
          setRiskZones(statsRes.value.data.high_risk_areas);
        if (statsRes.value.data.weekly_trends)
          setWeeklyTrends(statsRes.value.data.weekly_trends);
      }
      if (incRes.status === 'fulfilled') {
        const data = incRes.value.data;
        setIncidents(data.incidents || data);
      }
      if (alertRes.status === 'fulfilled') {
        const data = alertRes.value.data;
        setAlerts(data.alerts || data);
      }
      if (notificationRes.status === 'fulfilled') {
        const data = notificationRes.value.data;
        setNotifications(data.notifications || data);
      }
    }).finally(() => setLoadingAll(false));
  }, []);

  // ── addIncident — called by ReportIncident on success ─────────────────
  const addIncident = useCallback((newIncident) => {
    const normalized = {
      ...newIncident,
      incident_id: newIncident.incident_id || newIncident.id || `INC${Date.now()}`,
      status: newIncident.status === 'Pending' ? 'Reported' : (newIncident.status || 'Reported'),
      created_at: newIncident.created_at || new Date().toISOString().slice(0, 16).replace('T', ' '),
      description: newIncident.description || 'No description provided.',
    };

    setIncidents(prev => [normalized, ...prev]);

    setStats(prev => {
      const now     = new Date();
      const today   = now.toISOString().slice(0, 10);
      const isToday = normalized.created_at?.startsWith(today);

      return {
        ...prev,
        total_incidents:  prev.total_incidents + 1,
        todays_incidents: isToday ? prev.todays_incidents + 1 : prev.todays_incidents,
      };
    });
  }, []);

  // ── addAlert — called by Alerts page on broadcast ─────────────────────
  const addAlert = useCallback((newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    setStats(prev => ({
      ...prev,
      active_alerts_count: prev.active_alerts_count + 1,
    }));
  }, []);

  // ── refreshAll — manual hard reload ───────────────────────────────────
  const refreshAll = useCallback(() => {
    setLoadingAll(true);
    Promise.allSettled([getDashboardStats(), getIncidents(), getAlerts(), getNotifications()])
      .then(([statsRes, incRes, alertRes, notificationRes]) => {
        if (statsRes.status === 'fulfilled') {
          const data = statsRes.value.data;
          setStats(data);
          if (data.high_risk_areas)
            setRiskZones(data.high_risk_areas);
          if (data.weekly_trends)
            setWeeklyTrends(data.weekly_trends);
        }
        if (incRes.status === 'fulfilled') {
          const d = incRes.value.data;
          setIncidents(d.incidents || d);
        }
        if (alertRes.status === 'fulfilled') {
          const d = alertRes.value.data;
          setAlerts(d.alerts || d);
        }
        if (notificationRes.status === 'fulfilled') {
          const d = notificationRes.value.data;
          setNotifications(d.notifications || d);
        }
      }).finally(() => setLoadingAll(false));
  }, []);

  const updateIncidentStatusById = useCallback(async (incidentId, nextStatus) => {
    try {
      const response = await updateIncidentStatus(incidentId, nextStatus);
      const updatedStatus = response?.data?.status || nextStatus;
      setIncidents(prev => prev.map(item => (
        item.incident_id === incidentId || item.id === incidentId
          ? { ...item, status: updatedStatus }
          : item
      )));
      return { success: true, status: updatedStatus };
    } catch (error) {
      return { success: false, error: error?.response?.data?.error || 'Unable to update status.' };
    }
  }, []);

  return (
    <AppDataContext.Provider value={{
      incidents, alerts, notifications, stats, riskZones, weeklyTrends,
      loadingAll,
      addIncident, addAlert, refreshAll, updateIncidentStatus: updateIncidentStatusById,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
