import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, CalendarDays, MapPin, BrainCircuit, ShieldAlert, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/Card';
import Map from '../components/Map';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

const computeDynamicWeeklyTrends = (incidents = [], backendWeeklyTrends = []) => {
  if (backendWeeklyTrends && backendWeeklyTrends.length > 0) {
    return backendWeeklyTrends;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const countsByDay = {};
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const dayName = dayNames[d.getDay()];
    countsByDay[dayKey] = 0;
    chartData.push({ day: dayName, date: dayKey, incidents: 0 });
  }

  (incidents || []).forEach((inc) => {
    if (!inc.created_at) return;
    const incDate = inc.created_at.slice(0, 10);
    if (countsByDay[incDate] !== undefined) {
      countsByDay[incDate] += 1;
    }
  });

  return chartData.map((item) => ({
    ...item,
    incidents: countsByDay[item.date] || 0,
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-md)', padding: '0.6rem 0.85rem', fontSize: '0.8rem' }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ color: 'var(--blue)', fontWeight: 700 }}>{payload[0].value} incidents</div>
    </div>
  );
};

export default function Dashboard() {
  const { stats, weeklyTrends, riskZones, loadingAll, refreshAll, incidents, updateIncidentStatus } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [recentIncidentList, setRecentIncidentList] = useState([]);

  const reviewStatuses = ['Reported', 'Under Review', 'Verified', 'Resolved', 'Dismissed'];
  const canReviewIncidents = user?.role === 'ADMIN' || user?.role === 'SECURITY';

  const incidentSummary = useMemo(() => {
    return incidents?.slice(0, 5) || [];
  }, [incidents]);

  const chartWeeklyData = useMemo(() => {
    return computeDynamicWeeklyTrends(incidents, weeklyTrends);
  }, [incidents, weeklyTrends]);

  const openIncident = (incident) => {
    setSelectedIncident(incident);
    setRecentIncidentList(incidentSummary);
    setStatusMessage('');
  };

  const openIncidentList = () => {
    setSelectedIncident({ listMode: true, title: 'Recent incidents' });
    setRecentIncidentList(incidentSummary);
    setStatusMessage('');
  };

  const handleStatusChange = async (nextStatus) => {
    if (!selectedIncident) return;
    setStatusUpdating(true);
    setStatusMessage('');
    const incidentId = selectedIncident.incident_id || selectedIncident.id;
    const result = await updateIncidentStatus(incidentId, nextStatus);
    if (result.success) {
      setSelectedIncident({ ...selectedIncident, status: result.status });
      setStatusMessage(`Incident ${incidentId} marked as ${result.status}.`);
    } else {
      setStatusMessage(result.error || 'Status update failed.');
    }
    setStatusUpdating(false);
  };

  return (
    <div>
      {/* Page header with refresh */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="page-title">Real-Time Security Dashboard</h2>
          <p className="page-subtitle">KNUST Campus Overview &amp; Predictive Intelligence</p>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={refreshAll} title="Refresh all data" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Stat Cards — live from context */}
      <div className="grid-4">
        <StatCard
          label="Total Incidents"
          value={stats.total_incidents}
          icon={AlertTriangle}
          iconClass="red"
          meta="Historical & current"
          onClick={openIncidentList}
        />
        <StatCard
          label="Today's Incidents"
          value={stats.todays_incidents}
          icon={CalendarDays}
          iconClass="amber"
          meta="Last 24 hours"
          onClick={openIncidentList}
        />
        <StatCard
          label="High Risk Zones"
          value={stats.high_risk_areas_count}
          icon={MapPin}
          iconClass="red"
          meta="Active hotspots"
        />
        <StatCard
          label="Model Accuracy"
          value={stats.prediction_accuracy}
          icon={BrainCircuit}
          iconClass="green"
          meta="Random Forest"
        />
      </div>

      {/* Active Alerts counter card */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          className="card"
          onClick={() => navigate('/alerts')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') navigate('/alerts');
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon stat-icon-blue" style={{ width: 34, height: 34 }}>
              <ShieldAlert size={16} />
            </div>
            <div>
              <div className="stat-label">Active Alerts</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats.active_alerts_count}
              </div>
            </div>
          </div>
          <span className="badge badge-active">Live</span>
        </div>
      </div>

      <Modal isOpen={!!selectedIncident} onClose={() => setSelectedIncident(null)} title={selectedIncident?.listMode ? 'Recent incidents' : `Incident ${selectedIncident?.incident_id || selectedIncident?.id}`}>
        {selectedIncident && selectedIncident.listMode ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {recentIncidentList.length ? recentIncidentList.map((incident) => (
              <button
                key={incident.incident_id || incident.id}
                className="btn btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  textAlign: 'left',
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  gap: '0.5rem',
                  minWidth: 0,
                  height: 'auto',
                }}
                onClick={() => {
                  setSelectedIncident(incident);
                  setRecentIncidentList(incidentSummary);
                }}
              >
                <span style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  <strong>{incident.incident_id || incident.id}</strong> — {incident.category}
                </span>
                <span
                  className={`badge ${incident.status === 'Reported' ? 'badge-reported' : incident.status === 'Under Review' ? 'badge-under-review' : incident.status === 'Verified' ? 'badge-verified' : incident.status === 'Resolved' ? 'badge-resolved' : 'badge-dismissed'}`}
                  style={{ flexShrink: 0, fontSize: '0.68rem', padding: '0.2rem 0.45rem', whiteSpace: 'nowrap' }}
                >
                  {incident.status || 'Reported'}
                </span>
              </button>
            )) : (
              <div className="alert alert-info">No recent incidents available.</div>
            )}
          </div>
        ) : selectedIncident && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div><strong>Category:</strong> {selectedIncident.category}</div>
              <div><strong>Location:</strong> {selectedIncident.location_name}</div>
              <div><strong>Severity:</strong> <span className={`badge badge-${(selectedIncident.severity || 'medium').toLowerCase()}`}>{selectedIncident.severity}</span></div>
              <div><strong>Status:</strong> <span className={`badge badge-${(selectedIncident.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>{selectedIncident.status}</span></div>
              <div><strong>Reported:</strong> {selectedIncident.created_at}</div>
              <div><strong>Description:</strong> {selectedIncident.description || 'No description available.'}</div>
            </div>

            {canReviewIncidents && <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Review status</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {reviewStatuses.map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm ${selectedIncident.status === status ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusUpdating}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>}

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/incidents/${selectedIncident.incident_id || selectedIncident.id}`)}
            >
              Open full incident details
            </button>

            {statusMessage && (
              <div className={`alert ${statusMessage.includes('failed') || statusMessage.includes('Unable') ? 'alert-error' : 'alert-success'}`}>
                {statusMessage}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Map + Chart */}
      <div className="grid-2">
        <div>
          <p className="card-title" style={{ marginBottom: '0.75rem' }}>Campus GIS Hotspot Map</p>
          <Map />
        </div>

        <div className="card">
          <p className="card-title">Weekly Incident Trends</p>
          <p className="card-subtitle" style={{ marginBottom: '1.25rem' }}>KNUST campus — current week</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartWeeklyData} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="incidents" fill="var(--blue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Zones Table — live from context */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ShieldAlert size={16} color="var(--red)" />
          <p className="card-title" style={{ marginBottom: 0 }}>Top Predicted High-Risk Zones</p>
        </div>
        <Table
          headers={['Campus Location', 'Risk Level', 'Historical Incidents', 'Peak Threat Window']}
          data={riskZones}
          loading={loadingAll}
          renderRow={(item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{item.name}</td>
              <td>
                <span className={`badge badge-${(item.risk || item.risk_level || 'medium').toLowerCase()}`}>
                  {item.risk || item.risk_level}
                </span>
              </td>
              <td>{item.incidents}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{item.peak || '—'}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
