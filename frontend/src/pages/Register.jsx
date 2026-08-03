import React, { useState } from 'react';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'STUDENT' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration successful! Please login.");
    onSwitchToLogin();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Join the KNUST CampusShield AI network</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Username</label>
            <input type="text" required style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>KNUST Email</label>
            <input type="email" required style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role</label>
            <select style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }}>
              <option value="STUDENT">Student</option>
              <option value="SECURITY">Security Personnel</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register</button>
        </form>
      </div>
    </div>
  );
}
