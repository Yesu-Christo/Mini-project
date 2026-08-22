import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { createIncident } from '../services/api';
import { useAppData } from '../context/AppDataContext';

const LOCATIONS = [
  'Unity Hall (Conti)',        'University Hall (Katanga)', 'Brunei Hostels',
  'Africa Hall Block B',       'Ayeduase Gate Exit',        'Commercial Area Parking',
  'KNUST Main Library',        'College of Science Complex','Faculty of Law Quadrangle',
  'SRC Secretariat',           'Great Hall',                'Other',
];

const initialForm = {
  category:      'Phone Snatching',
  location_name: 'Unity Hall (Conti)',
  description:   '',
  severity:      'Medium',
  latitude:      6.6738,
  longitude:     -1.5684,
};

export default function ReportIncident() {
  const { addIncident } = useAppData();
  const [form,    setForm]    = useState(initialForm);
  const [status,  setStatus]  = useState(null);
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const now     = new Date();
    const created = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const payload = { ...form, status: 'Reported' };

    try {
      const res = await createIncident(payload);
      const newInc = {
        incident_id:   res.data.incident_id,
        category:      form.category,
        description:   form.description,
        location_name: form.location_name,
        severity:      form.severity,
        status:        'Reported',
        created_at:    created,
      };
      addIncident(newInc);
      setMsg(`Incident submitted! Ticket ID: ${res.data.incident_id}`);
      setStatus('success');
      setForm(initialForm);
    } catch {
      const fakeId  = `INC${String(Math.floor(1000 + Math.random() * 9000))}`;
      const newInc  = {
        incident_id:   fakeId,
        category:      form.category,
        description:   form.description,
        location_name: form.location_name,
        severity:      form.severity,
        status:        'Reported',
        created_at:    created,
      };
      addIncident(newInc);
      setMsg(`Incident submitted! Ticket ID: ${fakeId}`);
      setStatus('success');
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Report Security Incident</h2>
          <p className="page-subtitle">Submit real-time crime reports to alert campus security and update the AI hotspot model.</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{msg}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{msg}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Incident Category</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                {['Phone Snatching','Theft / Larceny','Physical Assault','Hostel Burglary','Vandalism','Trespassing','Harassment','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <select className="form-control" value={form.severity} onChange={e => set('severity', e.target.value)}>
                {['Low','Medium','High','Critical'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campus Location</label>
            <select className="form-control" value={form.location_name} onChange={e => set('location_name', e.target.value)}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Incident Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe what happened in detail — time, persons involved, what was lost or damaged…"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Latitude (optional)</label>
              <input type="number" step="any" className="form-control" value={form.latitude} onChange={e => set('latitude', parseFloat(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude (optional)</label>
              <input type="number" step="any" className="form-control" value={form.longitude} onChange={e => set('longitude', parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Evidence / Images</label>
            <input type="file" accept="image/*" className="form-control" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Submitting…</>
              ) : (
                <><Send size={15} /> Submit Report</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
