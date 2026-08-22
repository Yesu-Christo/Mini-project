import React, { useMemo } from 'react';
import { ArrowLeft, MapPin, ShieldAlert, CalendarDays, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const statusClass = {
  Reported: 'badge-reported',
  'Under Review': 'badge-under-review',
  Verified: 'badge-verified',
  Resolved: 'badge-resolved',
  Dismissed: 'badge-dismissed',
  Pending: 'badge-pending',
  'Under Investigation': 'badge-active',
  'False Alarm': 'badge-dismissed',
};

export default function IncidentDetail() {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { incidents } = useAppData();

  const incident = useMemo(() => {
    return incidents.find((item) => String(item.incident_id || item.id) === String(incidentId)) || null;
  }, [incidentId, incidents]);

  if (!incident) {
    return (
      <div className="card" style={{ maxWidth: 800, margin: '2rem auto' }}>
        <h2 className="page-title">Incident not found</h2>
        <p className="page-subtitle">This incident could not be loaded.</p>
        <button className="btn btn-primary" onClick={() => navigate('/incidents')}>
          <ArrowLeft size={15} /> Back to incidents
        </button>
      </div>
    );
  }

  const hasImage = !!(incident.image_url || incident.image || incident.evidence_url);
  const imageUrl = incident.image_url || incident.image || incident.evidence_url;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Incident Detail</h2>
          <p className="page-subtitle">{incident.incident_id || incident.id}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/incidents')}>
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="card" style={{ padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div className="stat-icon stat-icon-red">
              <ShieldAlert size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem' }}>{incident.category}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{incident.location_name}</div>
            </div>
          </div>

          <span className={`badge ${statusClass[incident.status] || 'badge-pending'}`}>
            {incident.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem', marginBottom: '1.3rem' }}>
          <div className="card" style={{ padding: '0.9rem 1rem', background: 'rgba(15,23,42,0.55)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Severity</div>
            <div><span className={`badge badge-${(incident.severity || 'medium').toLowerCase()}`}>{incident.severity}</span></div>
          </div>

          <div className="card" style={{ padding: '0.9rem 1rem', background: 'rgba(15,23,42,0.55)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Location</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}>
              <MapPin size={14} /> {incident.location_name}
            </div>
          </div>

          <div className="card" style={{ padding: '0.9rem 1rem', background: 'rgba(15,23,42,0.55)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Reported</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}>
              <CalendarDays size={14} /> {incident.created_at}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.3rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Description</div>
          <div style={{ lineHeight: 1.7, color: 'var(--text-primary)' }}>
            {incident.description || 'No description was provided for this incident.'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>Evidence Image</div>

          {hasImage ? (
            <div className="card" style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.55)' }}>
              <img
                src={imageUrl}
                alt="Incident evidence"
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', minHeight: 90 }}>
                <ImageIcon size={18} />
                <span>Image not available or could not be loaded.</span>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '1rem', background: 'rgba(15,23,42,0.55)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={18} />
              No evidence image submitted for this report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
