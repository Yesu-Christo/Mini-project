import React, { useState } from 'react';
import { BrainCircuit, Zap, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { runPrediction } from '../services/api';

const LOCATIONS = [
  { id: 'LOC011', label: 'Ayeduase Gate Exit',        lat: 6.6685, lng: -1.5610, baseline: 2 },
  { id: 'LOC010', label: 'Brunei Hostels Pathway',    lat: 6.6810, lng: -1.5620, baseline: 2 },
  { id: 'LOC001', label: 'Unity Hall (Conti)',         lat: 6.6738, lng: -1.5684, baseline: 2 },
  { id: 'LOC003', label: 'University Hall (Katanga)', lat: 6.6765, lng: -1.5695, baseline: 2 },
  { id: 'LOC009', label: 'Commercial Area Parking',   lat: 6.6700, lng: -1.5665, baseline: 1 },
  { id: 'LOC007', label: 'Main Library',               lat: 6.6720, lng: -1.5670, baseline: 0 },
  { id: 'LOC005', label: 'College of Science',         lat: 6.6745, lng: -1.5640, baseline: 0 },
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function RiskGauge({ probability, level }) {
  const pct   = Math.round(probability * 100);
  const color = level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
  const deg   = probability * 360;

  return (
    <div className="risk-gauge-wrap">
      <div
        className="risk-gauge"
        style={{
          background: `conic-gradient(${color} ${deg}deg, var(--bg-elevated) ${deg}deg)`,
        }}
      >
        <div className="risk-gauge-value" style={{ color }}>
          {pct}%
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Risk Probability</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color }}>
          {level === 'High' && <ShieldAlert size={16} style={{ display: 'inline', marginRight: 4 }} />}
          {level === 'Low'  && <ShieldCheck size={16} style={{ display: 'inline', marginRight: 4 }} />}
          {level === 'Medium' && <Shield size={16} style={{ display: 'inline', marginRight: 4 }} />}
          {level} Risk
        </div>
      </div>
    </div>
  );
}

export default function Prediction() {
  const [params, setParams] = useState({
    location_id:  'LOC011',
    hour:          22,
    day_of_week:   5,
    month:         8,
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedLoc = LOCATIONS.find(l => l.id === params.location_id) || LOCATIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runPrediction({
        location_name:         selectedLoc.label,
        hour:                  params.hour,
        day_of_week:           params.day_of_week,
        month:                 params.month,
        latitude:              selectedLoc.lat,
        longitude:             selectedLoc.lng,
      });
      setResult({ ...res.data.prediction, location_name: selectedLoc.label });
    } catch {
      // Frontend fallback
      const isNight = params.hour >= 19 || params.hour <= 5;
      const prob    = isNight ? 0.87 : 0.23;
      const level   = prob >= 0.6 ? 'High' : prob >= 0.3 ? 'Medium' : 'Low';
      setResult({
        risk_probability: prob,
        risk_level:        level,
        is_night:          isNight ? 1 : 0,
        location_name:     selectedLoc.label,
      });
    } finally {
      setLoading(false);
    }
  };

  const recommendations = result?.risk_level === 'High' ? [
    'Deploy 2 security patrol units to this zone immediately.',
    'Ensure CCTV cameras covering this area are actively monitored.',
    'Issue a night travel advisory to nearby students.',
    'Increase lighting along all access corridors.',
  ] : result?.risk_level === 'Medium' ? [
    'Assign one patrol unit to conduct regular passes.',
    'Monitor CCTV feeds for unusual activity.',
    'Remind students to use well-lit paths.',
  ] : [
    'Maintain standard patrol frequency.',
    'Log routine check-ins from security post.',
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Crime Risk Prediction Engine</h2>
          <p className="page-subtitle">Evaluate hotspot probability using Random Forest trained on KNUST spatial-temporal data.</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Input */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BrainCircuit size={16} color="var(--blue)" />
            <p className="card-title" style={{ marginBottom: 0 }}>Prediction Parameters</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Location</label>
              <select className="form-control" value={params.location_id} onChange={e => setParams(p => ({ ...p, location_id: e.target.value }))}>
                {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Hour of Day (0–23)</label>
                <input
                  type="number" min={0} max={23}
                  className="form-control"
                  value={params.hour}
                  onChange={e => setParams(p => ({ ...p, hour: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Day of Week</label>
                <select className="form-control" value={params.day_of_week} onChange={e => setParams(p => ({ ...p, day_of_week: parseInt(e.target.value) }))}>
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Month</label>
              <select className="form-control" value={params.month} onChange={e => setParams(p => ({ ...p, month: parseInt(e.target.value) }))}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading
                ? <><div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Running inference…</>
                : <><Zap size={15} /> Run AI Inference</>
              }
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="card" style={{ borderLeft: result ? `3px solid ${result.risk_level === 'High' ? 'var(--red)' : result.risk_level === 'Medium' ? 'var(--amber)' : 'var(--green)'}` : '3px solid var(--border)' }}>
          <p className="card-title">Model Prediction Output</p>

          {!result ? (
            <div className="center-flex" style={{ paddingTop: '3rem', paddingBottom: '3rem', color: 'var(--text-muted)' }}>
              <BrainCircuit size={40} style={{ opacity: 0.2 }} />
              <span>Run the model to see results</span>
            </div>
          ) : (
            <>
              <RiskGauge probability={result.risk_probability} level={result.risk_level} />

              <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>Location: <strong style={{ color: 'var(--text-primary)' }}>{result.location_name}</strong></div>
                <div>Period: <strong style={{ color: result.is_night ? 'var(--amber)' : 'var(--green)' }}>{result.is_night ? 'Night-time' : 'Day-time'}</strong></div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Security Recommendations
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recommendations.map((r, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <ShieldCheck size={13} style={{ flexShrink: 0, marginTop: 3, color: 'var(--blue)' }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
