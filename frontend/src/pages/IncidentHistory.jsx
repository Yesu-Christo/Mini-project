import React, { useState } from 'react';
import Table from '../components/Table';
import { RefreshCw } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const FILTERS = ['All', 'Pending', 'Under Investigation', 'Resolved'];
const statusClass = {
  Resolved:              'badge-resolved',
  Pending:               'badge-pending',
  'Under Investigation': 'badge-active',
};

export default function IncidentHistory() {
  const { incidents, loadingAll, refreshAll } = useAppData();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? incidents
    : incidents.filter(i => i.status === filter);

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
          data={filtered}
          loading={loadingAll}
          renderRow={(inc, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700, color: 'var(--blue)', fontSize: '0.82rem' }}>
                {inc.incident_id || inc.id}
              </td>
              <td style={{ fontWeight: 500 }}>{inc.category}</td>
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
