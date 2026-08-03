import React from 'react';

export default function Notification({ message, type = 'info' }) {
  if (!message) return null;
  const colors = {
    info: 'var(--primary-color)',
    success: 'var(--accent-green)',
    warning: 'var(--accent-warning)',
    error: 'var(--accent-red)'
  };

  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(30, 41, 59, 0.9)',
      borderLeft: `4px solid ${colors[type] || colors.info}`,
      color: '#fff',
      fontSize: '0.9rem',
      marginBottom: '1rem'
    }}>
      {message}
    </div>
  );
}
