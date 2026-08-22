import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { RefreshCw } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'Reported', 'Under Review', 'Verified', 'Resolved', 'Dismissed'];
const statusClass = {
  Reported: 'badge-pending',
  'Under Review': 'badge-active',
  Verified: 'badge-admin',
  Resolved: 'badge-resolved',
  Dismissed: 'badge-student',
  Pending: 'badge-pending',
  'Under Investigation': 'badge-active',
  'False Alarm': 'badge-student',
};

export default function IncidentHistory() {
  const { incidents, loadingAll, refreshAll } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? incidents
    : incidents.filter(i => i.status === filter);

  const orderedIncidents = [...filtered].sort((left, right) => {
    const leftOwn = String(left.reporter_id) === String(user?.id);
    const rightOwn = String(right.reporter_id) === String(user?.id);
    if (leftOwn !== rightOwn) return leftOwn ? -1 : 1;
    return String(right.created_at || '').localeCompare(String(left.created_at || ''));
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Incident History &amp; Logs</h2>
          <p className="page-subtitle">
            Complete audit trail of campus incident reports
            <span style={{ marginLeft: '0.75rem', background: 'var(--blue-dim)', color: 'var(--blue)', padding: '0.15rem 0.55rem', borderRadius: 'var(--r-full)', fontSize: '0.72rem', fontWeight: 700 }}>
              {incidents.length} total
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            >{f}</button>
          ))}
          <button className="btn btn-ghost btn-icon btn-sm" onClick={refreshAll} title="Refresh" aria-label="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="card">
        <Table
          headers={['ID', 'Category', 'Location', 'Severity', 'Status', 'Reported']}
          data={orderedIncidents}
          loading={loadingAll}
          renderRow={(inc, i) => (
            <tr
              key={i}
              onClick={() => navigate(`/incidents/${inc.incident_id || inc.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td style={{ fontWeight: 700, color: 'var(--blue)', fontSize: '0.82rem' }}>
                {inc.incident_id || inc.id}
              </td>
              <td style={{ fontWeight: 500 }}>
                {inc.category}
                {String(inc.reporter_id) === String(user?.id) && (
                  <span className="badge badge-active" style={{ marginLeft: '0.45rem' }}>My report</span>
                )}
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{inc.location_name}</td>
              <td>
                <span className={`badge badge-${(inc.severity || 'medium').toLowerCase()}`}>
                  {inc.severity}
                </span>
              </td>
              <td>
                <span className={`badge ${statusClass[inc.status] || 'badge-pending'}`}>
                  {inc.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{inc.created_at}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
