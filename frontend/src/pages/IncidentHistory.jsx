import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getIncidents } from '../services/api';
import { RefreshCw } from 'lucide-react';

const MOCK_INCIDENTS = [
  { id: 'INC0001', category: 'Phone Snatching',  location_name: 'Brunei Hostels',         severity: 'High',     status: 'Under Investigation', created_at: '2026-07-29 08:30' },
  { id: 'INC0002', category: 'Theft',             location_name: 'KNUST Main Library',     severity: 'Medium',   status: 'Pending',             created_at: '2026-07-28 19:45' },
  { id: 'INC0003', category: 'Vandalism',         location_name: 'Unity Hall (Conti)',     severity: 'Low',      status: 'Resolved',            created_at: '2026-07-27 22:15' },
  { id: 'INC0004', category: 'Assault',           location_name: 'Ayeduase Gate Exit',    severity: 'Critical', status: 'Under Investigation', created_at: '2026-07-26 01:10' },
  { id: 'INC0005', category: 'Burglary',          location_name: 'Africa Hall Block B',   severity: 'High',     status: 'Resolved',            created_at: '2026-07-25 14:00' },
];

const FILTERS = ['All', 'Pending', 'Under Investigation', 'Resolved'];

const statusClass = { Resolved: 'badge-resolved', Pending: 'badge-pending', 'Under Investigation': 'badge-active' };

export default function IncidentHistory() {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [filter,    setFilter]    = useState('All');
  const [loading,   setLoading]   = useState(true);

  const load = () => {
    setLoading(true);
    getIncidents()
      .then(res => setIncidents(res.data.incidents || res.data))
      .catch(() => setIncidents(MOCK_INCIDENTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'All' ? incidents : incidents.filter(i => i.status === filter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Incident History &amp; Logs</h2>
          <p className="page-subtitle">Complete audit trail of campus incident reports</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            >{f}</button>
          ))}
          <button className="btn btn-ghost btn-icon btn-sm" onClick={load} title="Refresh" aria-label="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="card">
        <Table
          headers={['ID', 'Category', 'Location', 'Severity', 'Status', 'Reported']}
          data={filtered}
          loading={loading}
          renderRow={(inc, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700, color: 'var(--blue)', fontSize: '0.82rem' }}>{inc.incident_id || inc.id}</td>
              <td style={{ fontWeight: 500 }}>{inc.category}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{inc.location_name}</td>
              <td><span className={`badge badge-${inc.severity.toLowerCase()}`}>{inc.severity}</span></td>
              <td><span className={`badge ${statusClass[inc.status] || 'badge-pending'}`}>{inc.status}</span></td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{inc.created_at}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
