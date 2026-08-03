import React from 'react';

/**
 * StatCard — shows a labelled metric with an icon
 * Card     — generic card container
 */

export function StatCard({ label, value, icon: Icon, iconClass = 'blue', meta, trend }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${iconClass}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {meta && <div className="stat-meta">{meta}</div>}
      </div>
    </div>
  );
}

export default function Card({ children, accent, className = '', style = {} }) {
  const accentClass = accent ? ` card-accent-${accent}` : '';
  return (
    <div className={`card${accentClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
