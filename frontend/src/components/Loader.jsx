import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(59,130,246,0.2)',
        borderTop: '3px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</div>
    </div>
  );
}
