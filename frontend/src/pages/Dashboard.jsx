import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, CalendarDays, MapPin, BrainCircuit, ShieldAlert, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/Card';
import Map from '../components/Map';
import Table from '../components/Table';
import { useAppData } from '../context/AppDataContext';

const weeklyData = [
  { day: 'Mon', incidents: 12 },
  { day: 'Tue', incidents: 18 },
  { day: 'Wed', incidents: 9  },
  { day: 'Thu', incidents: 24 },
  { day: 'Fri', incidents: 32 },
  { day: 'Sat', incidents: 45 },
  { day: 'Sun', incidents: 28 },
];

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
  const { stats, riskZones, loadingAll, refreshAll } = useAppData();

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
        />
        <StatCard
          label="Today's Incidents"
          value={stats.todays_incidents}
          icon={CalendarDays}
          iconClass="amber"
          meta="Last 24 hours"
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
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem' }}>
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
            <BarChart data={weeklyData} barSize={26}>
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
