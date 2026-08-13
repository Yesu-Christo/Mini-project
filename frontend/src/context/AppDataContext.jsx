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
} from '../services/api';

// ─── Seed data (shown when backend is offline) ────────────────────────────
const SEED_INCIDENTS = [
  { incident_id: 'INC0001', category: 'Phone Snatching',  location_name: 'Brunei Hostels',      severity: 'High',     status: 'Under Investigation', created_at: '2026-07-29 08:30' },
  { incident_id: 'INC0002', category: 'Theft',            location_name: 'KNUST Main Library',  severity: 'Medium',   status: 'Pending',             created_at: '2026-07-28 19:45' },
  { incident_id: 'INC0003', category: 'Vandalism',        location_name: 'Unity Hall (Conti)',  severity: 'Low',      status: 'Resolved',            created_at: '2026-07-27 22:15' },
  { incident_id: 'INC0004', category: 'Assault',          location_name: 'Ayeduase Gate Exit',  severity: 'Critical', status: 'Under Investigation', created_at: '2026-07-26 01:10' },
  { incident_id: 'INC0005', category: 'Burglary',         location_name: 'Africa Hall Block B', severity: 'High',     status: 'Resolved',            created_at: '2026-07-25 14:00' },
];

const SEED_ALERTS = [
  { id: 1, title: 'High Crime Risk Alert',   message: 'Increase patrol near Ayeduase Gate after 8 PM.',           alert_type: 'HIGH_RISK_ZONE',     location_name: 'Ayeduase Gate',   created_at: '10 mins ago' },
  { id: 2, title: 'Phone Snatching Warning', message: 'Multiple reports of phone snatching near Brunei Hostels.', alert_type: 'INCIDENT_BROADCAST', location_name: 'Brunei Hostels',  created_at: '1 hour ago' },
  { id: 3, title: 'Security Dispatch',       message: 'Patrol team 3 deployed to Commercial Area.',               alert_type: 'SECURITY_DISPATCH',  location_name: 'Commercial Area', created_at: '3 hours ago' },
];

const SEED_STATS = {
  total_incidents:      350,
  todays_incidents:     5,
  high_risk_areas_count: 4,
  prediction_accuracy:  '92.4%',
  active_alerts_count:  3,
};

const SEED_RISK_ZONES = [
  { name: 'Brunei Complex Path',     risk: 'High',   incidents: 42, peak: '20:00 – 02:00' },
  { name: 'Ayeduase Gate Exit',      risk: 'High',   incidents: 38, peak: '21:00 – 04:00' },
  { name: 'Unity Hall Backyard',     risk: 'High',   incidents: 29, peak: '22:00 – 03:00' },
  { name: 'Commercial Area Parking', risk: 'Medium', incidents: 18, peak: '19:00 – 23:00' },
];

// ─── Context ──────────────────────────────────────────────────────────────
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [incidents,  setIncidents]  = useState(SEED_INCIDENTS);
  const [alerts,     setAlerts]     = useState(SEED_ALERTS);
  const [stats,      setStats]      = useState(SEED_STATS);
  const [riskZones,  setRiskZones]  = useState(SEED_RISK_ZONES);
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
    ]).then(([statsRes, incRes, alertRes]) => {
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
    }).finally(() => setLoadingAll(false));
  }, []);

  // ── addIncident — called by ReportIncident on success ─────────────────
  const addIncident = useCallback((newIncident) => {
    setIncidents(prev => [newIncident, ...prev]);

    // update all affected stats immediately
    setStats(prev => {
      const now     = new Date();
      const today   = now.toISOString().slice(0, 10);
      const isToday = newIncident.created_at?.startsWith(today);

      // bump risk zone incident count if location matches
      setRiskZones(zones => zones.map(z =>
        newIncident.location_name?.toLowerCase().includes(z.name.split(' ')[0].toLowerCase())
          ? { ...z, incidents: z.incidents + 1 }
          : z
      ));

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
    Promise.allSettled([getDashboardStats(), getIncidents(), getAlerts()])
      .then(([statsRes, incRes, alertRes]) => {
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
      }).finally(() => setLoadingAll(false));
  }, []);

  return (
    <AppDataContext.Provider value={{
      incidents, alerts, stats, riskZones, weeklyTrends,
      loadingAll,
      addIncident, addAlert, refreshAll,
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
