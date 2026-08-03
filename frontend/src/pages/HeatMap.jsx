import React, { useState } from 'react';
import Map from '../components/Map';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const DANGER_ZONES = [
  { name: 'Ayeduase Gate Exit',      detail: 'High frequency of phone snatching incidents after 20:00.' },
  { name: 'Brunei Hostels Pathway',  detail: 'Poorly lit corridor; recurring theft and phone snatch reports.' },
  { name: 'Unity Hall Backyard',     detail: 'History of trespassing and property damage after midnight.' },
  { name: 'Commercial Area Parking', detail: 'Vehicle break-ins concentrated during evening hours.' },
];

const SAFE_ZONES = [
  { name: 'KNUST Main Library',         detail: '24/7 CCTV coverage and active security post at entrance.' },
  { name: 'College of Science Complex', detail: 'Well-lit walkways and security checkpoints throughout.' },
  { name: 'Faculty of Law Quadrangle',  detail: 'Consistently low risk index across all recorded time windows.' },
  { name: 'Great Hall Forecourt',       detail: 'Regular security patrols and high foot-traffic deterrence.' },
];

export default function HeatMap() {
  const [tab, setTab] = useState('all');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">GIS Campus Crime Heatmap</h2>
          <p className="page-subtitle">Spatial mapping of high-density crime zones and safe corridors across KNUST.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['all','All Zones'],['danger','Danger Zones'],['safe','Safe Zones']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`btn btn-sm ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--red)',   label: 'High Risk Zone' },
          { color: 'var(--amber)', label: 'Medium Risk Zone' },
          { color: 'var(--green)', label: 'Low / Safe Zone' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem' }}>
        <Map height="450px" />
      </div>

      <div className="grid-2">
        <div className="card card-accent-red">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <ShieldAlert size={15} color="var(--red)" />
            <p className="card-title" style={{ marginBottom: 0 }}>High-Density Danger Zones</p>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {DANGER_ZONES.map((z, i) => (
              <li key={i} style={{ padding: '0.7rem 0', borderBottom: i < DANGER_ZONES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{z.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{z.detail}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-accent-green">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <ShieldCheck size={15} color="var(--green)" />
            <p className="card-title" style={{ marginBottom: 0 }}>Designated Safe Zones</p>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SAFE_ZONES.map((z, i) => (
              <li key={i} style={{ padding: '0.7rem 0', borderBottom: i < SAFE_ZONES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{z.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{z.detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
