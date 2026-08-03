import React from 'react';

export default function Chart({ title, data = [] }) {
  const defaultData = [
    { label: 'Mon', count: 12 },
    { label: 'Tue', count: 18 },
    { label: 'Wed', count: 9 },
    { label: 'Thu', count: 24 },
    { label: 'Fri', count: 32 },
    { label: 'Sat', count: 45 },
    { label: 'Sun', count: 28 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const max = Math.max(...chartData.map(d => d.count), 50);

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>{title || "Weekly Incident Distribution"}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        {chartData.map((item, idx) => {
          const heightPercent = (item.count / max) * 100;
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{item.count}</span>
              <div style={{
                width: '100%',
                maxWidth: '28px',
                height: `${heightPercent}%`,
                background: 'linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.4s ease'
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
