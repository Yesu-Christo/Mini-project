import React, { useEffect, useState } from 'react';
import { Bell, Send, RefreshCw, AlertTriangle, Radio, Shield } from 'lucide-react';
import { getAlerts, createAlert } from '../services/api';

const MOCK_ALERTS = [
  { id: 1, title: 'High Crime Risk Alert',   message: 'Increase patrol near Ayeduase Gate after 8 PM.',           type: 'HIGH_RISK_ZONE',      location_name: 'Ayeduase Gate',  created_at: '10 mins ago' },
  { id: 2, title: 'Phone Snatching Warning', message: 'Multiple reports of phone snatching near Brunei Hostels.', type: 'INCIDENT_BROADCAST', location_name: 'Brunei Hostels', created_at: '1 hour ago' },
  { id: 3, title: 'Security Dispatch',       message: 'Patrol team 3 deployed to Commercial Area.',               type: 'SECURITY_DISPATCH',  location_name: 'Commercial Area', created_at: '3 hours ago' },
];

const TYPE_META = {
  HIGH_RISK_ZONE:      { label: 'High Risk Zone',    icon: AlertTriangle, color: 'var(--red)',    badgeClass: 'badge-high' },
  INCIDENT_BROADCAST:  { label: 'Broadcast',         icon: Radio,         color: 'var(--amber)',  badgeClass: 'badge-medium' },
  SECURITY_DISPATCH:   { label: 'Dispatch',          icon: Shield,        color: 'var(--blue)',   badgeClass: 'badge-active' },
};

export default function Alerts() {
  const [alerts,  setAlerts]  = useState(MOCK_ALERTS);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ title: '', message: '', location_name: 'Campus Wide', alert_type: 'HIGH_RISK_ZONE' });
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    getAlerts()
      .then(res => setAlerts(res.data.alerts || res.data))
      .catch(() => setAlerts(MOCK_ALERTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSending(true);
    try {
      const res = await createAlert(form);
      setAlerts(prev => [res.data, ...prev]);
    } catch {
      setAlerts(prev => [
        { id: Date.now(), ...form, created_at: 'Just now', is_active: true },
        ...prev,
      ]);
    } finally {
      setSending(false);
      setForm({ title: '', message: '', location_name: 'Campus Wide', alert_type: 'HIGH_RISK_ZONE' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Live Emergency Alerts</h2>
          <p className="page-subtitle">Broadcast security alerts to mobile devices and campus patrol units.</p>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={load} title="Refresh" aria-label="Refresh alerts">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="grid-2">
        {/* Compose */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
            <Send size={15} color="var(--blue)" />
            <p className="card-title" style={{ marginBottom: 0 }}>Broadcast New Alert</p>
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="form-group">
              <label className="form-label">Alert Type</label>
              <select className="form-control" value={form.alert_type} onChange={e => setForm(f => ({ ...f, alert_type: e.target.value }))}>
                {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Alert Title</label>
              <input type="text" className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. High Theft Warning" required />
            </div>
            <div className="form-group">
              <label className="form-label">Target Location</label>
              <input type="text" className="form-control" value={form.location_name} onChange={e => setForm(f => ({ ...f, location_name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea rows={3} className="form-control" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Enter alert details for security personnel…" required />
            </div>
            <button type="submit" className="btn btn-danger btn-full" disabled={sending}>
              {sending
                ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Sending…</>
                : <><Bell size={14} /> Broadcast Alert</>
              }
            </button>
          </form>
        </div>

        {/* Feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p className="card-title" style={{ marginBottom: 0 }}>Active Alerts</p>
            <span className="badge badge-active">{alerts.length} active</span>
          </div>

          {loading ? (
            <div className="center-flex"><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
              {alerts.map((a) => {
                const meta = TYPE_META[a.type || a.alert_type] || TYPE_META.INCIDENT_BROADCAST;
                const TypeIcon = meta.icon;
                return (
                  <div key={a.id} className="card card-sm" style={{ borderLeft: `3px solid ${meta.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TypeIcon size={13} color={meta.color} style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{a.title}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{a.created_at || a.time}</span>
                    </div>
                    {a.message && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{a.message}</p>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      📍 {a.location_name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
